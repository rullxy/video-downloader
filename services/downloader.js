const tiktok = require('./tiktok');

class DownloaderService {
  async downloadVideo(url) {
    if (url.includes('tiktok.com')) {
      return await tiktok.downloadWithoutWatermark(url);
    }
    return {
      success: false,
      message: 'Platform belum didukung. Saat ini hanya TikTok yang tersedia.'
    };
  }

  async downloadImages(url) {
    if (url.includes('tiktok.com')) {
      return await tiktok.downloadImages(url);
    }
    return {
      success: false,
      message: 'Download gambar hanya untuk TikTok'
    };
  }
}

module.exports = new DownloaderService();
