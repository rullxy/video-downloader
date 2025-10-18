const { Telegraf } = require('telegraf');
const config = require('./config');

console.log('🚀 Starting TikTok Downloader Bot...');

// Import Handlers
const startHandler = require('./handlers/start');
const messageHandler = require('./handlers/message');

if (!config.BOT_TOKEN) {
  console.error('❌ ERROR: BOT_TOKEN tidak ditemukan di file .env');
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

// Register Handlers
startHandler(bot);
messageHandler(bot);

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
    console.log('💻 Running on Termux');
  })
  .catch((error) => {
    console.error('❌ GAGAL menjalankan bot:', error.message);
    process.exit(1);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});
