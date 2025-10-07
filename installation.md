# Instagram Chat API Bot Documentation

## 📚 Table of Contents

- [Authentication Methods](#authentication-methods)
- [MQTT Real-time Messaging](#mqtt-real-time-messaging)
- [Core Features](#core-features)
- [Building & Publishing](#building--publishing)

---

## 🔐 Authentication Methods

### Method 1: Cookie Authentication (Recommended)

Cookie authentication allows you to bypass 2FA and login challenges by reusing an existing session.

#### Step 1: Export Cookies from Browser

**Using Cookie-Editor Extension:**

1. Install [Cookie-Editor](https://cookie-editor.cgagnier.ca/) for Chrome/Firefox
2. Login to Instagram on your browser
3. Click Cookie-Editor extension → Export → Export as JSON
4. Save the file as `account.json` in your project root

**Using EditThisCookie Extension:**

1. Install EditThisCookie
2. Login to Instagram
3. Export cookies in Netscape format
4. Save as `account.txt`

#### Step 2: Load Cookies in Code

```typescript
import { IgApiClient, CookieLoader } from 'insta-chat-api';

const ig = new IgApiClient();

// Generate device fingerprint
ig.state.generateDevice('your_username');

// Load cookies from JSON file
const cookieLoader = new CookieLoader(ig, './account.json');
const success = await cookieLoader.loadFromFile();

if (success) {
  console.log('✅ Logged in with cookies!');
  const user = await ig.account.currentUser();
  console.log(`Username: ${user.username}`);
} else {
  console.log('❌ Cookie login failed');
}
```

**Supported Cookie Formats:**

- `.json` - Cookie-Editor export format
- `.txt` - Netscape cookie format

### Method 2: Traditional Login

```typescript
import { IgApiClient } from 'insta-chat-api';
import * as dotenv from 'dotenv';

dotenv.config();

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);

// Optional: Set proxy
ig.state.proxyUrl = process.env.IG_PROXY;

// Login
await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
```

---

## 📡 MQTT Real-time Messaging

MQTT enables **instant** message receiving, typing indicators, and presence updates.

### Connecting to MQTT

```typescript
import { IgApiClient, CookieLoader } from 'insta-chat-api';

const ig = new IgApiClient();
ig.state.generateDevice('username');

// Login with cookies
const cookieLoader = new CookieLoader(ig, './account.json');
await cookieLoader.loadFromFile();

// Connect to Instagram MQTT server
await ig.mqtt.connect();
console.log('🟢 MQTT Connected!');
```

### MQTT Topics & Event Listeners

#### 1. Receive Messages Instantly

```typescript
ig.mqtt.on('/ig_message_sync', data => {
  console.log('📩 New message:', data);

  const threadId = data.thread_id;
  const text = data.item?.text || data.message?.text;
  const userId = data.user_id || data.message?.user_id;
  const timestamp = data.timestamp;

  console.log(`From: ${userId}`);
  console.log(`Message: ${text}`);
  console.log(`Thread: ${threadId}`);
});
```

#### 2. Typing Indicators

```typescript
// Listen for typing events
ig.mqtt.on('/ig_typing_indicator', data => {
  console.log(`⌨️ User ${data.sender_id} is typing in thread ${data.thread_id}`);
});

// Send typing indicator
const threadId = 'THREAD_ID_HERE';
ig.mqtt.sendTypingIndicator(threadId, true); // Start typing
await new Promise(r => setTimeout(r, 2000)); // Simulate typing
ig.mqtt.sendTypingIndicator(threadId, false); // Stop typing
```

#### 3. Message Delivery Status

```typescript
ig.mqtt.on('/ig_send_message_response', data => {
  console.log('✅ Message delivered:', data);
  console.log(`Item ID: ${data.item_id}`);
  console.log(`Client Context: ${data.client_context}`);
});
```

#### 4. User Presence (Online/Offline)

```typescript
ig.mqtt.on('/ig_presence', data => {
  console.log('👤 User presence update:', data);
  console.log(`User ID: ${data.user_id}`);
  console.log(`Is Active: ${data.is_active}`);
  console.log(`Last Seen: ${data.last_activity_at_ms}`);
});
```

#### 5. Real-time Subscriptions

```typescript
ig.mqtt.on('/ig_realtime_sub', data => {
  console.log('📲 Real-time update:', data);
});
```

### Complete MQTT Bot Example

```typescript
import { IgApiClient, CookieLoader } from 'insta-chat-api';

const ig = new IgApiClient();
ig.state.generateDevice('username');

// Login
const cookieLoader = new CookieLoader(ig, './account.json');
await cookieLoader.loadFromFile();

// Connect MQTT
await ig.mqtt.connect();

// Auto-reply bot
ig.mqtt.on('/ig_message_sync', async data => {
  const message = data.message || data;
  const threadId = message.thread_id;
  const text = message.item?.text || message.text;

  if (!text) return;

  console.log(`📩 Received: ${text}`);

  // Get thread entity
  const thread = ig.entity.directThread(threadId);

  // Auto-reply logic
  if (text.toLowerCase().includes('hello')) {
    // Show typing
    ig.mqtt.sendTypingIndicator(threadId, true);
    await new Promise(r => setTimeout(r, 1500));

    // Send reply
    await thread.broadcastText('Hi! How can I help you? 👋');

    // Stop typing
    ig.mqtt.sendTypingIndicator(threadId, false);
  }

  if (text.toLowerCase().includes('price')) {
    ig.mqtt.sendTypingIndicator(threadId, true);
    await new Promise(r => setTimeout(r, 1000));
    await thread.broadcastText('Our prices start at $99. DM me for details!');
    ig.mqtt.sendTypingIndicator(threadId, false);
  }
});

// Keep alive
console.log('🤖 Bot is running...');
process.on('SIGINT', async () => {
  await ig.mqtt.disconnect();
  process.exit();
});
```

---

## 🚀 Core Features

### 1. Send Messages

```typescript
const thread = ig.entity.directThread('THREAD_ID');

// Text message
await thread.broadcastText('Hello! 👋');

// Photo message
const photoBuffer = await fs.promises.readFile('./image.jpg');
await thread.broadcastPhoto({ file: photoBuffer });

// Video message
const videoBuffer = await fs.promises.readFile('./video.mp4');
await thread.broadcastVideo({ video: videoBuffer });

// Link message
await thread.broadcastLink('https://example.com', 'Check this out!');

// Voice message
const voiceBuffer = await fs.promises.readFile('./voice.mp4');
await thread.broadcastVoice({ file: voiceBuffer });
```

### 2. Get Direct Message Threads

```typescript
// Get inbox
const inbox = ig.feed.directInbox();
const threads = await inbox.items();

threads.forEach(thread => {
  console.log(`Thread ID: ${thread.thread_id}`);
  console.log(`Title: ${thread.thread_title}`);
  console.log(`Users: ${thread.users.map(u => u.username).join(', ')}`);
});
```

### 3. Get Thread Messages

```typescript
const threadFeed = ig.feed.directThread({ thread_id: 'THREAD_ID' });
const messages = await threadFeed.items();

messages.forEach(msg => {
  console.log(`From: ${msg.user_id}`);
  console.log(`Text: ${msg.text}`);
  console.log(`Timestamp: ${msg.timestamp}`);
});
```

### 4. Search Users

```typescript
const users = await ig.search.searchService.users('username');
console.log(users);
```

### 5. Upload Photo to Feed

```typescript
const photoBuffer = await fs.promises.readFile('./photo.jpg');

await ig.publish.photo({
  file: photoBuffer,
  caption: 'Amazing photo! 📸',
});
```

### 6. Upload Story

```typescript
const storyBuffer = await fs.promises.readFile('./story.jpg');

await ig.publish.story({
  file: storyBuffer,
});
```

### 7. Get User Info

```typescript
const userId = await ig.user.getIdByUsername('instagram');
const userInfo = await ig.user.info(userId);

console.log(userInfo);
```

### 8. Follow/Unfollow

```typescript
// Follow
await ig.friendship.create('USER_ID');

// Unfollow
await ig.friendship.destroy('USER_ID');
```

### 9. Like/Unlike Media

```typescript
// Like
await ig.media.like({ media_id: 'MEDIA_ID' });

// Unlike
await ig.media.unlike({ media_id: 'MEDIA_ID' });
```

---

## 📦 Building & Publishing to NPM

### Understanding Project Structure

```
src/                  ← Source TypeScript code (main development)
dist/                 ← Compiled JavaScript code (generated by build)
examples/             ← Example usage files
package.json          ← Package configuration
```

### Build Process

The project uses TypeScript and compiles to JavaScript:

```bash
npm run build
```

This command:

1. Removes old `dist/` folder
2. Compiles `src/**/*.ts` → `dist/**/*.js`
3. Generates type definitions `dist/**/*.d.ts`

### Package.json Configuration

```json
{
  "main": "dist/index.js", // Entry point for require()
  "types": "dist/index.d.ts", // TypeScript definitions
  "files": [
    "dist" // Only dist/ is published to NPM
  ],
  "scripts": {
    "build": "rimraf dist && tsc -p tsconfig.build.json",
    "prepare": "npm run build" // Auto-builds before publish
  }
}
```

### What Gets Published to NPM?

**✅ Published:**

- `dist/` folder (compiled JavaScript)
- `package.json`
- `README.md`
- `LICENSE`

**❌ NOT Published:**

- `src/` folder (TypeScript source)
- `examples/` folder
- `node_modules/`
- `.env` files
- Development files

### Publishing to NPM

#### Step 1: Build the project

```bash
npm run build
```

#### Step 2: Test locally

```bash
npm pack
# Creates insta-chat-api-1.0.0.tgz
# Extract and inspect to verify contents
```

#### Step 3: Login to NPM

```bash
npm login
```

#### Step 4: Publish

```bash
npm publish
```

### Important Notes

1. **`src/` is for development** - This is where you write code
2. **`dist/` is for distribution** - This is what users download from NPM
3. **Don't delete `dist/` manually** - It's auto-generated by `npm run build`
4. **`npm publish` automatically runs `npm run build`** via the `prepare` script

### Version Management

Update version before publishing:

```bash
# Patch: 1.0.0 → 1.0.1
npm version patch

# Minor: 1.0.0 → 1.1.0
npm version minor

# Major: 1.0.0 → 2.0.0
npm version major
```

### After Publishing

Users will install your package:

```bash
npm install insta-chat-api
```

And use it:

```typescript
import { IgApiClient, CookieLoader } from 'insta-chat-api';
// This imports from dist/index.js
```

---

## 🔧 Development Workflow

1. **Write code in `src/`**
2. **Test locally**: `npm run build && node dist/index.js`
3. **Commit changes**: `git add . && git commit -m "message"`
4. **Build**: `npm run build`
5. **Version**: `npm version patch`
6. **Publish**: `npm publish`

---

## ⚠️ Important Security Notes

- **Never commit `account.json` or `account.txt`** - Add to `.gitignore`
- **Use `.env` for credentials** - Never hardcode passwords
- **Rotate cookies periodically** - Sessions can expire
- **Use HTTPS/MQTTS** - Already configured in MQTT client

---
