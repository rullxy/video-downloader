const { Telegraf } = require('telegraf');
const express = require('express');
require('dotenv').config();

const config = require('./config');

console.log('🚀 Starting Telegram Bot with Simple API...');

// Import Handlers
const startHandler = require('./handlers/start');
const messageHandler = require('./handlers/message');

if (!config.BOT_TOKEN) {
  console.error('❌ ERROR: BOT_TOKEN tidak ditemukan!');
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

// Simple in-memory statistics
let stats = {
  totalDownloads: 0,
  totalUsers: new Set(),
  lastActivity: new Date(),
  botStatus: 'online',
  startTime: new Date()
};

// Track downloads and users
function trackDownload(userId) {
  stats.totalDownloads++;
  stats.totalUsers.add(userId);
  stats.lastActivity = new Date();
  console.log(`📊 Download tracked - Total: ${stats.totalDownloads}, Users: ${stats.totalUsers.size}`);
}

// Update message handler to track downloads
const originalMessageHandler = require('./handlers/message');
const wrappedMessageHandler = (ctx) => {
  // Track user
  stats.totalUsers.add(ctx.from.id);
  stats.lastActivity = new Date();
  
  return originalMessageHandler(ctx, {
    onDownload: () => trackDownload(ctx.from.id)
  });
};

bot.on('text', wrappedMessageHandler);
startHandler(bot);

// Error Handling
bot.catch((err, ctx) => {
  console.error('🔥 Bot Error:', err);
  ctx.reply('❌ Terjadi kesalahan sistem');
});

// Start Bot
bot.launch()
  .then(async () => {
    const botInfo = await bot.telegram.getMe();
    console.log('✅ BOT BERHASIL BERJALAN!');
    console.log('🤖 Bot:', botInfo.first_name);
    console.log('🔗 Username: @' + botInfo.username);
  })
  .catch((error) => {
    console.error('❌ GAGAL menjalankan bot:', error.message);
    process.exit(1);
  });

// Simple Express API Server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(require('cors')());
app.use(express.json());

// API Routes
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalDownloads: stats.totalDownloads,
      totalUsers: stats.totalUsers.size,
      lastActivity: stats.lastActivity,
      botStatus: stats.botStatus,
      uptime: Math.floor((new Date() - stats.startTime) / 1000 / 60) + ' minutes'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bot is running',
    timestamp: new Date().toISOString(),
    botStatus: 'online'
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TikTok Bot Dashboard</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        .status { 
          background: rgba(76, 175, 80, 0.3); 
          color: white; 
          padding: 10px 20px; 
          border-radius: 20px; 
          display: inline-block;
          margin-bottom: 20px;
        }
        .stats { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
          margin: 20px 0; 
        }
        .stat-card { 
          background: rgba(255,255,255,0.2); 
          padding: 20px; 
          border-radius: 10px; 
          text-align: center;
          backdrop-filter: blur(5px);
        }
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin: 10px 0;
        }
        .btn {
          background: white;
          border: none;
          padding: 12px 25px;
          margin: 10px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 TikTok Downloader Bot</h1>
        <div class="status">🟢 Bot & API are running</div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>Total Downloads</h3>
            <div class="stat-value">${stats.totalDownloads}</div>
          </div>
          <div class="stat-card">
            <h3>Total Users</h3>
            <div class="stat-value">${stats.totalUsers.size}</div>
          </div>
          <div class="stat-card">
            <h3>Uptime</h3>
            <div class="stat-value">${Math.floor((new Date() - stats.startTime) / 1000 / 60)}m</div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <button class="btn" onclick="window.open('https://t.me/${bot.telegram?.getMe()?.then(me => me.username) || 'your_bot'}', '_blank')">
            🤖 Open Bot
          </button>
          <button class="btn" onclick="location.reload()">
            🔄 Refresh
          </button>
        </div>
        
        <p><strong>API Endpoints:</strong></p>
        <ul>
          <li><code>GET /api/stats</code> - Bot statistics</li>
          <li><code>GET /api/health</code> - Health check</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 API Server running on port ${PORT}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
