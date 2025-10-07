
import * as mqtt from 'mqtt';
import debug from 'debug';
import { IgApiClient } from './client';

const logger = debug('ig:mqtt');

export interface MqttConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  clientId?: string;
}

export class InstagramMqttClient {
  private client: mqtt.MqttClient | null = null;
  private subscriptions: Map<string, Function[]> = new Map();

  constructor(private ig: IgApiClient) {}

  async connect(config?: Partial<MqttConfig>): Promise<void> {
    const defaultConfig: MqttConfig = {
      host: 'edge-chat.instagram.com',
      port: 443,
      clientId: this.ig.state.deviceId,
      ...config,
    };

    const connectUrl = `mqtts://${defaultConfig.host}:${defaultConfig.port}`;
    
    this.client = mqtt.connect(connectUrl, {
      clientId: defaultConfig.clientId,
      username: defaultConfig.username,
      password: defaultConfig.password,
      clean: true,
      reconnectPeriod: 1000,
    });

    return new Promise((resolve, reject) => {
      this.client!.on('connect', () => {
        logger('MQTT connected successfully');
        this.subscribeToTopics();
        resolve();
      });

      this.client!.on('error', (err) => {
        logger('MQTT connection error:', err);
        reject(err);
      });

      this.client!.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });
    });
  }

  private subscribeToTopics(): void {
    if (!this.client) return;

    // Subscribe to direct messages and real-time events
    this.client.subscribe('/ig_message_sync', { qos: 1 });
    this.client.subscribe('/ig_realtime_sub', { qos: 1 });
    this.client.subscribe('/ig_send_message', { qos: 1 });
    this.client.subscribe('/ig_send_message_response', { qos: 1 });
    
    // Typing indicator
    this.client.subscribe('/ig_typing_indicator', { qos: 1 });
    
    // Presence updates
    this.client.subscribe('/ig_presence', { qos: 1 });
    
    // Activity status
    this.client.subscribe('/ig_activity_indicator_id', { qos: 1 });
    
    logger('Subscribed to Instagram MQTT topics');
  }

  /**
   * Send typing indicator to a thread
   * @param threadId - The thread ID to send typing indicator to
   * @param isTyping - Whether user is typing (true) or stopped (false)
   */
  public sendTypingIndicator(threadId: string, isTyping: boolean = true): void {
    if (!this.client || !this.client.connected) {
      logger('MQTT not connected, cannot send typing indicator');
      return;
    }

    const payload = {
      thread_id: threadId,
      activity_status: isTyping ? '1' : '0',
      client_context: Date.now().toString(),
    };

    this.client.publish('/ig_typing_indicator', JSON.stringify(payload), { qos: 1 });
    logger(`Typing indicator sent: ${isTyping ? 'typing' : 'stopped'}`);
  }

  private handleMessage(topic: string, message: Buffer): void {
    try {
      const data = JSON.parse(message.toString());
      logger(`Message received on ${topic}:`, data);

      const handlers = this.subscriptions.get(topic);
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    } catch (error) {
      logger('Error parsing MQTT message:', error);
    }
  }

  on(topic: string, callback: Function): void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    this.subscriptions.get(topic)!.push(callback);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      return new Promise((resolve) => {
        this.client!.end(() => {
          logger('MQTT disconnected');
          resolve();
        });
      });
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}
