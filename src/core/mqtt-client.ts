import * as WebSocket from 'ws';
import debug from 'debug';
import { IgApiClient } from './client';

const logger = debug('ig:mqtt');

export interface MqttConfig {
  host?: string;
  topics?: string[];
}

export class InstagramMqttClient {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, Function[]> = new Map();
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private sessionId: string | null = null;

  constructor(private ig: IgApiClient) {}

  async connect(config?: Partial<MqttConfig>): Promise<void> {
    if (this.isConnecting || this.ws?.readyState === 1) {
      logger('Already connected or connecting');
      return;
    }

    this.isConnecting = true;

    try {
      const cookies = await this.ig.state.cookieJar.getCookies('https://www.instagram.com');
      const cookieHeader = cookies.map(c => `${c.key}=${c.value}`).join('; ');

      const sessionCookie = cookies.find(c => c.key === 'sessionid');
      const deviceIdCookie = cookies.find(c => c.key === 'ig_did');

      if (!sessionCookie) {
        throw new Error('Missing sessionid cookie for MQTT');
      }

      const deviceId = deviceIdCookie?.value || this.generateClientId();
      this.sessionId = sessionCookie.value.split('%')[0]; // Extract actual session ID

      // Use Instagram's edge-chat endpoint with proper session ID
      const wsUrl = `wss://edge-chat.instagram.com/chat?sid=${this.sessionId}&cid=${deviceId}`;

      logger('Connecting to:', wsUrl);

      this.ws = new WebSocket(wsUrl, {
        headers: {
          Host: 'edge-chat.instagram.com',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
          Connection: 'Upgrade',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          Upgrade: 'websocket',
          Origin: 'https://www.instagram.com',
          'Sec-WebSocket-Version': '13',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
          Cookie: cookieHeader,
        },
      });

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.isConnecting = false;
          reject(new Error('Connection timeout'));
        }, 15000);

        this.ws!.on('open', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          logger('✅ MQTT WebSocket connected');

          // Send MQTT CONNECT packet
          this.sendConnectPacket();
          this.setupHeartbeat();
          this.setupReconnect();
          resolve();
        });

        this.ws!.on('message', (data: Buffer) => {
          this.handleMessage(data);
        });

        this.ws!.on('error', err => {
          clearTimeout(timeout);
          this.isConnecting = false;
          logger('❌ MQTT error:', err.message);
          reject(err);
        });

        this.ws!.on('close', () => {
          this.isConnecting = false;
          logger('🔌 MQTT disconnected');
          this.cleanup();
          this.setupReconnect();
        });
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private generateClientId(): string {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  private sendConnectPacket(): void {
    if (!this.isConnected()) return;

    // Instagram MQTT CONNECT packet
    // Connect payload is currently not used but kept for future reference
    // const connectPayload = {
    //   clientIdentifier: this.client.state.phoneId.substring(0, 20),
    //   clientInfo: {
    //     userId: BigInt(this.client.state.cookieUserId),
    //     userAgent: this.client.state.appUserAgent,
    //     clientCapabilities: 183,
    //     endpointCapabilities: 0,
    //     publishFormat: 1,
    //     noAutomaticForeground: false,
    //     makeUserAvailableInForeground: true,
    //     deviceId: this.client.state.uuid,
    //     isInitiallyForeground: true,
    //     networkType: 1,
    //     networkSubtype: 0,
    //     clientMqttSessionId: BigInt(Date.now()) & BigInt(0xffffffff),
    //     subscribeTopics: [88, 135, 149, 150, 133, 146],
    //     clientType: 'cookie_auth',
    //     appId: BigInt(567067343352427),
    //     deviceSecret: '',
    //     clientStack: 3,
    //   },
    //   password: `sessionid=${this.client.state.extractCookieValue('sessionid')}`,
    //   getDiffsRequests: [],
    //   zeroRating: null,
    //   appSpecificInfo: {
    //     app_version: this.client.state.appVersion,
    //     'X-IG-Capabilities': this.client.state.capabilitiesHeader,
    //     everclear_subscriptions:
    //       '{\"inapp_notification_subscribe_comment\":\"17899377895239777\",\"inapp_notification_subscribe_comment_mention_and_reply\":\"17899377895239777\",\"video_call_participant_state_delivery\":\"17977239895057311\",\"presence_subscribe\":\"17846944882223835\"}',
    //     'User-Agent': this.client.state.appUserAgent,
    //     'Accept-Language': this.client.state.language.replace('_', '-'),
    //     platform: 'android',
    //     ig_mqtt_route': 'django',
    //     pubsub_msg_type_blacklist': 'direct, typing_type',
    //     auth_cache_enabled': '0',
    //   },
    // };

    // Subscribe to message topics immediately after connect
    setTimeout(() => {
      this.subscribeToMessages();
    }, 100);

    logger('📡 MQTT CONNECT sent');
  }

  private subscribeToMessages(): void {
    if (!this.isConnected()) return;

    // Instagram MQTT subscribe packet for direct messages
    const subscribeTopics = [
      '/ig_message_sync',
      '/ig_send_message_response',
      '/ig_typing_indicator',
      '/ig_sub_iris_response',
      '/pubsub',
    ];

    subscribeTopics.forEach(topic => {
      const subscribePacket = this.buildSubscribePacket(topic);
      this.ws!.send(subscribePacket);
      logger(`📡 Subscribed to ${topic}`);
    });
  }

  private buildSubscribePacket(topic: string): Buffer {
    // MQTT SUBSCRIBE packet format
    const topicBytes = Buffer.from(topic, 'utf8');
    const packetId = Math.floor(Math.random() * 65535);

    // Fixed header: SUBSCRIBE (0x82), Remaining length
    const fixedHeader = Buffer.from([0x82, topicBytes.length + 5]);

    // Variable header: Packet ID
    const variableHeader = Buffer.from([(packetId >> 8) & 0xff, packetId & 0xff]);

    // Payload: Topic length + topic + QoS
    const topicLength = Buffer.from([(topicBytes.length >> 8) & 0xff, topicBytes.length & 0xff]);

    const qos = Buffer.from([0x01]); // QoS 1

    return Buffer.concat([fixedHeader, variableHeader, topicLength, topicBytes, qos]);
  }

  private setupHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        // MQTT PINGREQ packet
        const pingPacket = Buffer.from([0xc0, 0x00]);
        this.ws!.send(pingPacket);
        logger('💓 PINGREQ sent');
      }
    }, 30000);
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private setupReconnect(): void {
    if (this.reconnectInterval) return;

    this.reconnectInterval = setInterval(() => {
      if (!this.isConnected() && !this.isConnecting) {
        logger('🔄 Reconnecting...');
        this.connect().catch(err => {
          logger('Reconnect failed:', err.message);
        });
      }
    }, 5000);
  }

  private handleMessage(data: Buffer): void {
    try {
      // Parse MQTT packet
      const messageType = (data[0] >> 4) & 0x0f;

      logger('📩 MQTT packet type:', messageType.toString(16));

      // PUBLISH packet (type 3)
      if (messageType === 3) {
        const qos = (data[0] >> 1) & 0x03;
        let pos = 1;

        // Decode remaining length (skip it, we don't need the value)
        let byte;
        do {
          byte = data[pos++];
        } while ((byte & 128) !== 0);

        // Topic name length
        const topicLength = (data[pos] << 8) | data[pos + 1];
        pos += 2;

        // Topic name
        const topic = data.slice(pos, pos + topicLength).toString('utf8');
        pos += topicLength;

        // Packet ID (if QoS > 0)
        if (qos > 0) {
          pos += 2;
        }

        // Payload
        const payload = data.slice(pos);

        logger(`📬 Topic: ${topic}`);
        logger(`📦 Payload:`, payload.toString('utf8').substring(0, 200));

        // Parse JSON payload
        try {
          const jsonPayload = JSON.parse(payload.toString('utf8'));
          this.triggerHandlers(topic, jsonPayload);
          this.triggerHandlers('*', { topic, data: jsonPayload });
        } catch {
          // Binary or non-JSON payload
          logger('Binary payload received');
        }
      }

      // PINGRESP (type 13)
      if (messageType === 13) {
        logger('💓 PINGRESP received');
      }
    } catch (error) {
      logger('Error parsing MQTT packet:', error);
    }
  }

  private triggerHandlers(topic: string, data: any): void {
    const handlers = this.subscriptions.get(topic);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (err) {
          logger('Handler error:', err);
        }
      });
    }
  }

  public sendTypingIndicator(threadId: string, isTyping: boolean = true): void {
    if (!this.isConnected()) {
      logger('❌ MQTT not connected');
      return;
    }

    const payload = {
      thread_id: threadId,
      activity_status: isTyping ? '1' : '0',
      client_context: Date.now().toString(),
    };

    const topic = '/ig_typing_indicator';
    const payloadStr = JSON.stringify(payload);
    const publishPacket = this.buildPublishPacket(topic, payloadStr);

    this.ws!.send(publishPacket);
    logger(`✅ Typing ${isTyping ? 'started' : 'stopped'}`);
  }

  private buildPublishPacket(topic: string, payload: string): Buffer {
    const topicBytes = Buffer.from(topic, 'utf8');
    const payloadBytes = Buffer.from(payload, 'utf8');

    const topicLength = Buffer.from([(topicBytes.length >> 8) & 0xff, topicBytes.length & 0xff]);

    const remainingLength = 2 + topicBytes.length + payloadBytes.length;
    const fixedHeader = Buffer.from([0x30, remainingLength]);

    return Buffer.concat([fixedHeader, topicLength, topicBytes, payloadBytes]);
  }

  on(topic: string, callback: Function): void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    this.subscriptions.get(topic)!.push(callback);
  }

  off(topic: string, callback?: Function): void {
    if (!callback) {
      this.subscriptions.delete(topic);
    } else {
      const handlers = this.subscriptions.get(topic);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    }
  }

  async disconnect(): Promise<void> {
    this.cleanup();

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.ws) {
      return new Promise(resolve => {
        this.ws!.once('close', () => {
          logger('MQTT disconnected');
          resolve();
        });
        this.ws!.close();
      });
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === 1;
  }
}
