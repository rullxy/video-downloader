const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tiktok-bot';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema untuk stats
const statsSchema = new mongoose.Schema({
  totalDownloads: { type: Number, default: 0 },
  totalUsers: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  botStatus: { type: String, default: 'online' }
});

const Stats = mongoose.model('Stats', statsSchema);

// Routes
app.get('/api/stats', async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bot API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TikTok Bot API</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .status { background: #4CAF50; color: white; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>🤖 TikTok Downloader Bot API</h1>
      <div class="status">🟢 API is running</div>
      <p><strong>Endpoints:</strong></p>
      <ul>
        <li><code>GET /api/stats</code> - Bot statistics</li>
        <li><code>GET /api/health</code> - Health check</li>
      </ul>
      <p><a href="/api/stats">View Stats</a></p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
