# Instagram DM Auto-Responder Bot

This bot automatically responds to messages in a specific Instagram DM thread using cookie authentication.

## Setup Instructions

### 1. Get Your Thread ID

Run the test script to see your recent DM threads:

```bash
node test-dm.js
```

This will display your recent DM threads with their IDs. Copy the Thread ID you want to monitor.

### 2. Configure the Bot

Open `index.js` and update these values:

```javascript
const THREAD_ID = 'YOUR_THREAD_ID_HERE'; // Paste your thread ID
const AUTO_RESPONSE_MESSAGE = 'Your custom auto-response message';
const CHECK_INTERVAL = 5000; // Check interval in milliseconds
```

### 3. Run the Bot

Start the auto-responder:

```bash
node index.js
```

The bot will:

- Connect using cookies from `cookie.json`
- Monitor the specified thread for new messages
- Automatically respond to any incoming messages
- Mark messages as seen

## Features

- ✅ Cookie-based authentication (no password needed)
- ✅ Real-time MQTT support for instant responses
- ✅ Polling fallback if MQTT fails
- ✅ Auto-mark messages as seen
- ✅ Configurable response message and check interval

## How It Works

1. **Authentication**: Loads Instagram cookies from `cookie.json`
2. **MQTT Connection**: Connects to Instagram's real-time messaging service
3. **Message Monitoring**: Listens for new messages in the specified thread
4. **Auto-Response**: Sends configured response to any new message
5. **Fallback Polling**: If MQTT fails, polls the thread every 5 seconds

## Troubleshooting

**No messages detected?**

- Make sure the THREAD_ID is correct
- Verify cookies are valid (not expired)
- Check that someone else sent a message (bot ignores its own messages)

**MQTT connection failed?**

- Don't worry! The bot will use polling as fallback
- Messages will still be detected, just with a slight delay

## Stop the Bot

Press `Ctrl+C` to stop the bot gracefully.
