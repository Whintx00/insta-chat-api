# insta-chat-api

A complete Instagram Private API wrapper for Node.js with full access to Instagram features including messaging, media upload, stories, and more.

[![npm version](https://img.shields.io/npm/v/insta-chat-api.svg)](https://www.npmjs.com/package/insta-chat-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### 🔐 Authentication

- Cookie-based login (JSON/Netscape format)
- Username/Password login
- Two-Factor Authentication (2FA) support
- Session management & persistence
- Challenge handling

### 💬 Direct Messaging (Complete)

- **Send Messages**: Text, photos, videos, voice notes, links, profiles, posts, stories
- **Real-time Receiving**: MQTT support for instant message delivery (live chat)
- **Typing Indicators**: Send and receive typing status in real-time
- **Presence Updates**: Online/offline status detection
- **Thread Management**: Create groups, add/remove users, mute, approve requests, update titles
- **Message Operations**: Delete, mark as seen, reply to stories, forward
- **Unlimited Messaging**: No artificial limits - fetch/send unlimited messages
- **Bulk Operations**: Send to multiple threads/users at once
- **Auto-reply Bots**: Build chatbots with MQTT real-time listeners

### 📸 Media & Content

- Upload photos (single/carousel/albums)
- Upload videos (feed/IGTV/reels)
- Upload stories (photo/video)
- Story stickers (polls, questions, quizzes, countdowns, chat, location, mentions, hashtags, sliders)
- Download media from URLs
- Media insights and analytics
- Media info and likers

### 👥 Social Features

- Follow/Unfollow users
- Get followers/following lists
- Search users, hashtags, locations
- View user profiles and feeds
- Like/Comment on posts
- Manage friendships (show friendship status, besties)
- Block/Unblock users
- Restrict/Unrestrict actions

### 📺 Live & Stories

- Create and manage live broadcasts
- RTMP streaming support (OBS integration)
- View and interact with stories
- Story viewers list
- Highlights management (create, edit)
- Live comments and viewer count
- Live question handling

### 📊 Feeds & Discovery

- Timeline feed
- User feeds
- Hashtag feeds
- Location feeds
- Explore/Discover feeds
- Saved posts feed
- Liked posts feed
- IGTV browse and channel feeds
- Music feeds (trending, genre, mood, search)
- Reels feed

### 🔧 Advanced Features

- MQTT real-time events (message sync, typing indicators, presence)
- Proxy support
- Device simulation
- GraphQL queries
- State serialization
- Comprehensive error handling for all Instagram errors
- Cookie loading from multiple formats

## 📦 Installation

```bash
npm install insta-chat-api
```

## 🔧 Quick Start

### Basic Login

```typescript
import { IgApiClient } from 'insta-chat-api';

const ig = new IgApiClient();

// Generate device and state
ig.state.generateDevice(process.env.IG_USERNAME);

// Login
await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
```

### Login with Cookie Import

Import cookies from Cookie-Editor extension or any cookie export tool:

```typescript
import { IgApiClient, CookieLoader } from 'insta-chat-api';

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);

// Load cookies from JSON file (Cookie-Editor format)
const cookieLoader = new CookieLoader(ig, './account.json');
await cookieLoader.loadFromFile();

// Or from Netscape format (.txt)
const cookieLoaderTxt = new CookieLoader(ig, './account.txt');
await cookieLoaderTxt.loadFromFile();
```

### Cookie File Formats

#### JSON Format (Cookie-Editor Extension):

```json
[
  {
    "name": "sessionid",
    "value": "your_session_id",
    "domain": ".instagram.com",
    "path": "/",
    "secure": true,
    "httpOnly": true
  }
]
```

#### Netscape Format (.txt):

```
# Netscape HTTP Cookie File
.instagram.com	TRUE	/	TRUE	1234567890	sessionid	your_session_id
```

## 📚 API Documentation

### Account Operations

#### Login

```typescript
const user = await ig.account.login(username, password);
console.log(`Logged in as ${user.username}`);
```

#### Two-Factor Authentication

```typescript
try {
  await ig.account.login(username, password);
} catch (err) {
  if (err.name === 'IgLoginTwoFactorRequiredError') {
    const code = '123456'; // Get from user
    await ig.account.twoFactorLogin({
      username,
      verificationCode: code,
      twoFactorIdentifier: err.response.body.two_factor_info.two_factor_identifier,
    });
  }
}
```

#### Get Current User

```typescript
const currentUser = await ig.account.currentUser();
console.log(currentUser);
```

#### Edit Profile

```typescript
await ig.account.editProfile({
  biography: 'New bio',
  external_url: 'https://example.com',
  email: 'newemail@example.com',
});
```

#### Change Password

```typescript
await ig.account.changePassword(oldPassword, newPassword);
```

### Real-time Messaging with MQTT

#### Connect MQTT for Real-time Messages

```typescript
// Connect to Instagram MQTT for real-time message receiving
await ig.mqtt.connect();

// Listen for incoming messages
ig.mqtt.on('/ig_message_sync', message => {
  console.log('New message:', message);
});

// Listen for typing indicators
ig.mqtt.on('/ig_typing_indicator', data => {
  console.log('User typing:', data);
});

// Listen for presence updates
ig.mqtt.on('/ig_presence', data => {
  console.log('User presence:', data);
});

// Send typing indicator
ig.mqtt.sendTypingIndicator(threadId, true); // Start typing
ig.mqtt.sendTypingIndicator(threadId, false); // Stop typing

// Check connection status
console.log('MQTT connected:', ig.mqtt.isConnected());

// Disconnect when done
await ig.mqtt.disconnect();
```

### Direct Messaging

#### Get Inbox

```typescript
const inbox = ig.feed.directInbox();
const threads = await inbox.items();
console.log(threads);
```

#### Send Text Message

```typescript
const thread = ig.entity.directThread(threadId);
await thread.broadcastText('Hello from API!');
```

#### Send Photo

```typescript
const imageBuffer = fs.readFileSync('./photo.jpg');
await thread.broadcastPhoto({ file: imageBuffer });
```

#### Send Video

```typescript
const videoBuffer = fs.readFileSync('./video.mp4');
await thread.broadcastVideo({ video: videoBuffer });
```

#### Send Voice Note

```typescript
const audioBuffer = fs.readFileSync('./voice.wav');
await thread.broadcastVoice({
  file: audioBuffer,
  waveform: [0.5, 0.8, 1.0, 0.7, 0.3],
  waveformSamplingFrequencyHz: 10,
});
```

#### Thread Management

```typescript
const thread = ig.entity.directThread(threadId);

// Mark as seen
await thread.markItemSeen(itemId);

// Delete message
await thread.deleteItem(itemId);

// Update thread title
await ig.directThread.updateTitle(threadId, 'New Group Name');

// Mute/Unmute
await ig.directThread.mute(threadId);
await ig.directThread.unmute(threadId);

// Add users to group
await ig.directThread.addUser(threadId, [userId1, userId2]);

// Leave thread
await ig.directThread.leave(threadId);
```

### Media Upload

#### Upload Photo

```typescript
const imageBuffer = fs.readFileSync('./photo.jpg');
await ig.publish.photo({
  file: imageBuffer,
  caption: 'Amazing photo! 📸',
});
```

#### Upload Video

```typescript
const videoBuffer = fs.readFileSync('./video.mp4');
const coverBuffer = fs.readFileSync('./cover.jpg');

await ig.publish.video({
  video: videoBuffer,
  coverImage: coverBuffer,
  caption: 'Check out this video! 🎥',
});
```

#### Upload Story

```typescript
const imageBuffer = fs.readFileSync('./story.jpg');
await ig.publish.story({
  file: imageBuffer,
});
```

#### Upload Album/Carousel

```typescript
const items = [
  { file: fs.readFileSync('./photo1.jpg'), type: 'photo' },
  { file: fs.readFileSync('./photo2.jpg'), type: 'photo' },
];

await ig.publish.album({
  items,
  caption: 'Photo album! 📷',
});
```

### Feeds

#### Timeline Feed

```typescript
const timelineFeed = ig.feed.timeline();
const posts = await timelineFeed.items();
```

#### User Feed

```typescript
const userFeed = ig.feed.user(userId);
const userPosts = await userFeed.items();
```

#### Hashtag Feed

```typescript
const hashtagFeed = ig.feed.tag('nodejs');
const tagPosts = await hashtagFeed.items();
```

#### Location Feed

```typescript
const locationFeed = ig.feed.location(locationId);
const locationPosts = await locationFeed.items();
```

### User Interactions

#### Follow/Unfollow

```typescript
await ig.friendship.create(userId); // Follow
await ig.friendship.destroy(userId); // Unfollow
```

#### Get Followers

```typescript
const followersFeed = ig.feed.accountFollowers(userId);
const followers = await followersFeed.items();
```

#### Get Following

```typescript
const followingFeed = ig.feed.accountFollowing(userId);
const following = await followingFeed.items();
```

#### Friendship Status

```typescript
const friendship = await ig.friendship.show(userId);
console.log(friendship);
```

### Search

#### Search Users

```typescript
const users = await ig.search.users('username');
```

#### Search Hashtags

```typescript
const hashtags = await ig.search.tags('nodejs');
```

#### Search Locations

```typescript
const locations = await ig.search.location('New York');
```

### State Management

#### Save Session

```typescript
const state = await ig.state.serialize();
fs.writeFileSync('session.json', JSON.stringify(state));
```

#### Restore Session

```typescript
const savedState = JSON.parse(fs.readFileSync('session.json', 'utf-8'));
await ig.state.deserialize(savedState);
```

## 📨 Complete Messaging Features

### Live Chat Example with Auto-Reply

```typescript
import { IgApiClient, CookieLoader } from 'insta-chat-api';

const ig = new IgApiClient();
ig.state.generateDevice('username');
const cookieLoader = new CookieLoader(ig, './account.json');
await cookieLoader.loadFromFile();

// Connect MQTT
await ig.mqtt.connect();
console.log('🟢 Live chat connected!');

// Auto-reply to incoming messages
ig.mqtt.on('/ig_message_sync', async data => {
  const message = data.message || data;
  const threadId = message.thread_id;
  const text = message.text || message.item?.text;
  const userId = message.user_id;

  console.log(`📩 Message from ${userId} in ${threadId}: ${text}`);

  // Auto-reply
  if (text && text.toLowerCase().includes('hello')) {
    const thread = ig.entity.directThread(threadId);

    // Send typing indicator
    ig.mqtt.sendTypingIndicator(threadId, true);
    await new Promise(r => setTimeout(r, 1000));

    // Send reply
    await thread.broadcastText('Hi there! How can I help you?');

    // Stop typing indicator
    ig.mqtt.sendTypingIndicator(threadId, false);
  }
});

// Keep the connection alive
process.on('SIGINT', async () => {
  await ig.mqtt.disconnect();
  process.exit();
});
```

### Fetching Message History

```typescript
// Get inbox with all threads
const inbox = ig.feed.directInbox();
const threads = await inbox.items();

// Get messages from specific thread
const threadFeed = ig.feed.directThread(threadId);
const messages = await threadFeed.items();

// Load more messages (pagination)
while (threadFeed.isMoreAvailable()) {
  const moreMessages = await threadFeed.items();
  console.log('Loaded more messages:', moreMessages.length);
}
```

## 🔐 Security Best Practices

1. **Never commit credentials**: Use environment variables
2. **Store cookies securely**: Encrypt cookie files in production
3. **Rate limiting**: Implement delays between requests
4. **Session management**: Save and reuse sessions
5. **Error handling**: Always handle authentication errors properly

## 📝 Environment Variables

Create a `.env` file:

```env
IG_USERNAME=your_username
IG_PASSWORD=your_password
```

## 🛠️ Advanced Usage

### Simulate Mobile Device

```typescript
await ig.simulate.preLoginFlow();
await ig.account.login(username, password);
await ig.simulate.postLoginFlow();
```

### Custom Proxy

```typescript
ig.state.proxyUrl = 'http://proxy.example.com:8080';
```

### Debug Mode

```typescript
// Enable debug logs
process.env.DEBUG = 'ig:*';
```

## 🔄 Update to Latest Version

```bash
npm install insta-chat-api@latest
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Owner

**ST | Sheikh Tamim**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⚠️ Disclaimer

This library is not affiliated with Instagram. Use at your own risk. Respect Instagram's Terms of Service and rate limits.

## 🐛 Common Issues

### Challenge Required

If Instagram challenges your login, you'll need to verify through the app or email.

### Rate Limiting

Implement delays between requests to avoid rate limits:

```typescript
await new Promise(resolve => setTimeout(resolve, 2000));
```

### Session Expired

Save and restore sessions to avoid repeated logins:

```typescript
const session = await ig.state.serialize();
// Save session...
// Later, restore:
await ig.state.deserialize(session);
```

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ by ST | Sheikh Tamim
