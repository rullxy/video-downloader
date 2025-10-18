const downloader = require('../services/downloader');
const axios = require('axios');

// Fungsi untuk download image ke buffer
async function downloadImageToBuffer(url) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    throw new Error(`Gagal download gambar: ${error.message}`);
  }
}

// Export utama untuk bot
module.exports = (ctx, trackers = {}) => {
  const message = ctx.message.text;
  
  // Handle command download gambar
  if (message.startsWith('/image')) {
    const url = message.replace('/image', '').trim();
    if (!url) {
      return ctx.reply('❌ Format: /image [link_tiktok]');
    }
    return handleImageDownload(ctx, url, trackers);
  }
  
  // Handle normal URL (video download)
  const urlRegex = /https?:\/\/[^\s]+/g;
  const url = message.match(urlRegex);

  if (!url) {
    return ctx.reply('❌ Silakan kirim link TikTok yang valid');
  }

  return handleVideoDownload(ctx, url[0], trackers);
};

async function handleVideoDownload(ctx, url, trackers = {}) {
  const processingMsg = await ctx.reply('⏳ Sedang memproses video...');

  try {
    const result = await downloader.downloadVideo(url);
    
    if (result.success) {
      // Track download jika ada tracker
      if (trackers.onDownload) {
        trackers.onDownload();
      }
      
      // Cek ukuran file
      try {
        const headResponse = await axios.head(result.data.videoUrl, { timeout: 10000 });
        const contentLength = headResponse.headers['content-length'];
        const fileSizeMB = contentLength ? contentLength / (1024 * 1024) : 0;

        console.log(`📊 Video size: ${fileSizeMB.toFixed(1)}MB`);

        if (fileSizeMB > 0 && fileSizeMB <= 50) {
          await ctx.replyWithVideo(
            { url: result.data.videoUrl },
            { 
              caption: `📹 ${result.data.title}`,
              parse_mode: 'HTML'
            }
          );
          console.log('✅ Video sent as video message');
        } else {
          await ctx.replyWithDocument(
            { url: result.data.videoUrl },
            { 
              caption: `📹 ${result.data.title}\n📁 Dikirim sebagai document (ukuran: ${fileSizeMB > 0 ? fileSizeMB.toFixed(1) + 'MB' : 'unknown'})`,
              parse_mode: 'HTML'
            }
          );
          console.log('✅ Video sent as document');
        }
      } catch (sizeError) {
        console.log('⚠️ Cannot check file size, sending as document');
        await ctx.replyWithDocument(
          { url: result.data.videoUrl },
          { caption: `📹 ${result.data.title}`, parse_mode: 'HTML' }
        );
      }
    } else {
      await ctx.reply(`❌ ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Error processing video:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses video');
  } finally {
    try {
      await ctx.deleteMessage(processingMsg.message_id);
    } catch (e) {
      console.log('Cannot delete processing message');
    }
  }
}

async function handleImageDownload(ctx, url, trackers = {}) {
  const processingMsg = await ctx.reply('⏳ Sedang memproses gambar...');

  try {
    const result = await downloader.downloadImages(url);
    
    if (result.success) {
      // Track download jika ada tracker
      if (trackers.onDownload) {
        trackers.onDownload();
      }
      
      if (result.data.type === 'images' && result.data.images && result.data.images.length > 0) {
        console.log(`🖼️ Sending ${result.data.images.length} images`);
        
        for (let i = 0; i < result.data.images.length; i++) {
          try {
            const imageBuffer = await downloadImageToBuffer(result.data.images[i]);
            
            await ctx.replyWithPhoto(
              { source: imageBuffer },
              { 
                caption: i === 0 ? `📸 ${result.data.title}` : '',
                parse_mode: 'HTML'
              }
            );
            
          } catch (photoError) {
            console.error(`❌ Error sending image ${i + 1}:`, photoError.message);
            try {
              const imageBuffer = await downloadImageToBuffer(result.data.images[i]);
              await ctx.replyWithDocument(
                { source: imageBuffer, filename: `image_${i+1}.jpg` },
                { caption: `📸 ${result.data.title} (Gambar ${i + 1})` }
              );
            } catch (docError) {
              console.error(`❌ Error sending document ${i + 1}:`, docError.message);
              await ctx.reply(`❌ Gagal mengirim gambar ${i + 1}`);
            }
          }
          
          if (i < result.data.images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        console.log('✅ All images sent successfully');
      } else {
        await ctx.reply('❌ Tidak ada gambar yang bisa dikirim');
      }
    } else {
      await ctx.reply(`❌ ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Error processing images:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses gambar');
  } finally {
    try {
      await ctx.deleteMessage(processingMsg.message_id);
    } catch (e) {
      console.log('Cannot delete processing message');
    }
  }
}
