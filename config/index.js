require('dotenv').config();

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
};

// Validasi config
if (!config.BOT_TOKEN) {
  console.error('❌ ERROR: BOT_TOKEN tidak ditemukan di environment variables');
  process.exit(1);
}

module.exports = config;
