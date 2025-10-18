const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');

class RemoveBackground {
  async removeBackground(imageBuffer) {
    try {
      console.log('🎨 Processing image for background removal...');

      if (!config.REMOVE_BG_API_KEY) {
        throw new Error('Remove.bg API key not configured');
      }

      const formData = new FormData();
      formData.append('image_file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });
      
      // Optional: Improve quality for people
      formData.append('size', 'auto');
      formData.append('type', 'auto');

      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': config.REMOVE_BG_API_KEY,
          ...formData.getHeaders()
        },
        timeout: 30000
      });

      console.log('✅ Background removed successfully');
      return {
        success: true,
        imageBuffer: Buffer.from(response.data, 'binary'),
        format: 'png'
      };
    } catch (error) {
      console.error('❌ Remove.bg API error:', error.response?.data || error.message);
      
      if (error.response?.status === 402) {
        return {
          success: false,
          message: '❌ Free quota exceeded. Limit 50 images/month reached.'
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message: '❌ Invalid API key. Check your Remove.bg API key.'
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          message: '❌ Cannot detect subject in image. Try with clearer photo.'
        };
      }
      
      return {
        success: false,
        message: '❌ Failed to remove background. Try again later.'
      };
    }
  }
}

module.exports = new RemoveBackground();
