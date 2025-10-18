const axios = require('axios');

class TikTokDownloader {
  async downloadWithoutWatermark(url) {
    try {
      console.log('📥 Processing TikTok URL:', url);
      
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });
      
      if (response.data && response.data.data && response.data.data.play) {
        console.log('✅ TikTok video berhasil diunduh');
        
        return {
          success: true,
          data: {
            videoUrl: response.data.data.play,
            title: response.data.data.title || 'Video TikTok',
            cover: response.data.data.cover,
            duration: response.data.data.duration,
            type: 'video'
          }
        };
      } else {
        return {
          success: false,
          message: 'Gagal mengunduh video TikTok'
        };
      }
    } catch (error) {
      console.error('❌ TikTok download error:', error.message);
      return {
        success: false,
        message: 'Gagal mengunduh video TikTok. Coba lagi nanti.'
      };
    }
  }

  async downloadImages(url) {
    try {
      console.log('📸 Downloading TikTok images:', url);
      
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });
      
      if (response.data && response.data.data && response.data.data.images) {
        console.log('✅ TikTok images berhasil diunduh, jumlah:', response.data.data.images.length);
        
        return {
          success: true,
          data: {
            images: response.data.data.images,
            title: response.data.data.title || 'TikTok Images',
            type: 'images'
          }
        };
      } else {
        return {
          success: false,
          message: 'Tidak ada gambar ditemukan di post TikTok ini'
        };
      }
    } catch (error) {
      console.error('❌ TikTok images download error:', error.message);
      return {
        success: false,
        message: 'Gagal mengunduh gambar dari TikTok.'
      };
    }
  }
}

module.exports = new TikTokDownloader();
