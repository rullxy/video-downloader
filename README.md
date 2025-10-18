# TikTok Downloader Bot + RemoveBG

[![Telegram](https://img.shields.io/badge/Telegram-Bot-blue.svg)](https://telegram.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A powerful Telegram bot that lets you download TikTok videos without watermark and remove backgrounds from images - all in one place!

## ✨ Features

### 🎬 TikTok Downloader
- ✅ **Download videos** - High quality without watermark
- ✅ **Download images** - From TikTok slideshows
- ✅ **Smart format** - Auto sends as video (<50MB) or document (>50MB)
- ✅ **Fast processing** - Quick download and delivery

### 🎨 Remove Background
- ✅ **AI-powered** - Professional background removal
- ✅ **Transparent PNG** - Perfect for editing
- ✅ **Free tier** - 50 images/month (Remove.bg API)
- ✅ **Multiple formats** - Supports JPG, PNG, JPEG

### ⚡ User Experience
- ✅ **Simple commands** - Easy to use
- ✅ **Real-time progress** - Know what's happening
- ✅ **Error handling** - Helpful error messages
- ✅ **Cancel option** - Stop processing anytime

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or higher
- Telegram account
- Remove.bg account (for background removal)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rullxy/video-downloader.git
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
nano .env
# Edit .env with your credentials
```

4. **Configure your .env file**
```env
BOT_TOKEN=your_telegram_bot_token_here
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

5. **Run the bot**
```bash
npm start
```

## 📱 Usage

### For TikTok Downloads:
1. **Send any TikTok link** - Bot will automatically download the video
2. **For images** - Use `/image [tiktok_link]`

### For Background Removal:
1. **Type `/removebg`**
2. **Send your photo** - Person, product, or object
3. **Get transparent PNG** - Ready for editing

### All Commands:
- `/start` - Show bot introduction
- `/help` - Get help and instructions  
- `/removebg` - Remove background from images
- `/image [link]` - Download TikTok images
- `/cancel` - Cancel current operation

## 🛠️ Configuration

### Get Telegram Bot Token:
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Use `/newbot` command
3. Follow instructions and get your token

### Get Remove.bg API Key:
1. Sign up at [remove.bg](https://remove.bg)
2. Go to [API Dashboard](https://www.remove.bg/api)
3. Get your free API key (50 images/month)

## 📁 Project Structure

```
tiktok-bot/
├── config/
│   └── index.js          # Environment configuration
├── handlers/
│   ├── start.js          # /start command handler
│   └── message.js        # Message processing
├── services/
│   ├── downloader.js     # TikTok download service
│   ├── tiktok.js         # TikTok API integration
│   └── removebg.js       # Background removal service
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
├── index.js              # Main bot file
└── package.json          # Dependencies
```

## 🔧 Technologies Used

- [Telegraf](https://telegraf.js.org) - Telegram Bot Framework
- [Axios](https://axios-http.com) - HTTP requests
- [Remove.bg API](https://remove.bg) - Background removal
- [TikWM API](https://tikwm.com) - TikTok download

## 🌟 Advanced Features

- **Smart file handling** - Auto chooses between video/document
- **Image buffer processing** - No temporary files needed
- **Rate limiting ready** - Easy to implement user limits
- **Error recovery** - Handles API failures gracefully
- **State management** - Tracks user sessions for background removal

## 🤝 Contributing

We love contributions! Here's how to help:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Todo Features

- [ ] Audio extraction from TikTok videos
- [ ] Video information display
- [ ] User statistics and analytics
- [ ] Rate limiting per user
- [ ] Support for more social platforms
- [ ] Video compression options
- [ ] Batch downloads

## ⚠️ Limitations

- TikTok download depends on third-party API
- Remove.bg free tier: 50 images/month
- Video size limit: 50MB for native Telegram videos
- Processing time: 5-30 seconds depending on file size

## 🔒 Privacy

- No user data stored permanently
- Images processed through Remove.bg API are not stored
- Temporary file buffers are cleared after processing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help:
1. Check the `/help` command in the bot
2. Open an [issue](https://github.com/yourusername/tiktok-bot/issues)
3. Contact the maintainer

## 🙏 Acknowledgments

- [Telegram](https://telegram.org) for amazing bot platform
- [Remove.bg](https://remove.bg) for background removal API
- [TikWM](https://tikwm.com) for TikTok download API
- [Telegraf.js](https://telegraf.js.org) for robust bot framework

---

**⭐ Star this repo if you find it helpful!**

**🎯 Pro Tip:** For best background removal results, use photos with clear contrast between subject and background!

---

<div align="center">

**Made with ❤️ and ☕ by [rullxy]**

[![Telegram](https://img.shields.io/badge/Contact-Bot-blue?style=for-the-badge&logo=telegram)](https://t.me/your_bot_username)

</div>

## 📞 Contact

- Telegram: [@Rullxo](https://t.me/rullxo)
- GitHub: [@rullxy](https://github.com/rullxy)
- Issues: [Project Issues](https://github.com/yourusername/tiktok-bot/issues)
