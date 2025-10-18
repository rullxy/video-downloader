const downloader = require('../services/downloader');
const removebg = require('../services/removebg');
const axios = require('axios');

// State untuk track user yang mau remove background
const removeBgUsers = new Set();

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

module.exports = (bot) => {
  // ==================== REMOVE BG HANDLERS ====================
  bot.command('removebg', async (ctx) => {
    removeBgUsers.add(ctx.from.id);
    await ctx.replyWithHTML(
      '🖼️ <b>Remove Background Tool</b>\n\n' +
      'Kirim gambar/foto yang ingin dihapus background-nya.\n\n' +
      '<i>Tips untuk hasil terbaik:</i>\n' +
      '• 📸 Foto orang → Hasil terbaik\n' + 
      '• 🎯 Foto benda → Hasil bagus\n' +
      '• 🌈 Background kontras → Hasil lebih bersih\n\n' +
      '⏰ Bot akan menunggu gambar Anda...\n' +
      '❌ Ketik /cancel untuk batal\n\n' +
      '<code>Limit: 50 gambar/bulan (free)</code>'
    );
  });

  bot.command('cancel', (ctx) => {
    if (removeBgUsers.has(ctx.from.id)) {
      removeBgUsers.delete(ctx.from.id);
      ctx.reply('❌ Remove background dibatalkan.');
    }
  });

  // Handler untuk photo message (remove background)
  bot.on('photo', async (ctx) => {
    if (removeBgUsers.has(ctx.from.id)) {
      removeBgUsers.delete(ctx.from.id);
      await handleRemoveBackground(ctx, 'photo');
    }
  });

  // Handler untuk document (image) remove background
  bot.on('document', async (ctx) => {
    if (removeBgUsers.has(ctx.from.id)) {
      const document = ctx.message.document;
      const mimeType = document.mime_type;
      
      if (mimeType && mimeType.startsWith('image/')) {
        removeBgUsers.delete(ctx.from.id);
        await handleRemoveBackground(ctx, 'document');
      } else {
        ctx.reply('❌ File harus berupa gambar (JPG, PNG, dll)');
      }
    }
  });

  // ==================== TIKTOK DOWNLOADER HANDLERS ====================
  bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    
    // Cancel remove bg mode jika user ketik text lain
    if (removeBgUsers.has(ctx.from.id) && !message.startsWith('/')) {
      removeBgUsers.delete(ctx.from.id);
      ctx.reply('❌ Mode remove background dibatalkan. Kirim /removebg untuk memulai lagi.');
    }
    
    // Handle command download gambar TikTok
    if (message.startsWith('/image')) {
      const url = message.replace('/image', '').trim();
      if (!url) {
        return ctx.reply('❌ Format: /image [link_tiktok]');
      }
      return await handleImageDownload(ctx, url);
    }
    
    // Handle normal URL (video download)
    const urlRegex = /https?:\/\/[^\s]+/g;
    const url = message.match(urlRegex);

    if (!url) {
      // Jika bukan URL, cek apakah ini command yang tidak dikenali
      if (message.startsWith('/')) {
        return ctx.reply('❌ Command tidak dikenali. Gunakan /start untuk melihat commands yang tersedia.');
      }
      return;
    }

    await handleVideoDownload(ctx, url[0]);
  });

  // Handle callback queries (jika ada button di future)
  bot.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
    // Bisa ditambah handler untuk button di future
  });
};

// ==================== REMOVE BACKGROUND FUNCTION ====================
async function handleRemoveBackground(ctx, type) {
  const processingMsg = await ctx.reply('⏳ Sedang menghapus background...');

  try {
    let imageBuffer;
    
    if (type === 'photo') {
      // Dapatkan photo dengan kualitas tertinggi (yang terakhir biasanya highest quality)
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const fileUrl = await ctx.telegram.getFileLink(photo.file_id);
      
      // Download image
      const response = await axios({
        method: 'GET',
        url: fileUrl.href,
        responseType: 'arraybuffer',
        timeout: 30000
      });
      imageBuffer = Buffer.from(response.data, 'binary');
      
    } else if (type === 'document') {
      const document = ctx.message.document;
      const fileUrl = await ctx.telegram.getFileLink(document.file_id);
      
      const response = await axios({
        method: 'GET',
        url: fileUrl.href,
        responseType: 'arraybuffer',
        timeout: 30000
      });
      imageBuffer = Buffer.from(response.data, 'binary');
    }

    console.log('📸 Processing image for background removal...');
    
    // Process remove background
    const result = await removebg.removeBackground(imageBuffer);
    
    if (result.success) {
      await ctx.replyWithDocument(
        { 
          source: result.imageBuffer,
          filename: `no-background.${result.format}`
        },
        {
          caption: '✅ <b>Background berhasil dihapus!</b>\n\n' +
                  '🔹 Format: PNG transparan\n' +
                  '🔹 Kualitas: Auto\n' +
                  '🔹 Siap untuk editing\n\n' +
                  '<i>Gunakan gambar ini untuk desain atau kolase!</i>',
          parse_mode: 'HTML'
        }
      );
      console.log('✅ Background removal sent successfully');
    } else {
      await ctx.reply(result.message);
    }
  } catch (error) {
    console.error('❌ Error in background removal:', error);
    await ctx.reply('❌ Gagal memproses gambar. Pastikan gambar valid dan coba lagi.');
  } finally {
    try {
      await ctx.deleteMessage(processingMsg.message_id);
    } catch (e) {
      console.log('Cannot delete processing message');
    }
  }
}

// ==================== TIKTOK VIDEO DOWNLOAD FUNCTION ====================
async function handleVideoDownload(ctx, url) {
  const processingMsg = await ctx.reply('⏳ Sedang memproses video...');

  try {
    const result = await downloader.downloadVideo(url);
    
    if (result.success) {
      // Cek ukuran file untuk memutuskan kirim sebagai video atau document
      try {
        const headResponse = await axios.head(result.data.videoUrl, { timeout: 10000 });
        const contentLength = headResponse.headers['content-length'];
        const fileSizeMB = contentLength ? contentLength / (1024 * 1024) : 0;

        console.log(`📊 Video size: ${fileSizeMB.toFixed(1)}MB`);

        if (fileSizeMB > 0 && fileSizeMB <= 50) {
          // Video <=50MB, kirim sebagai video
          await ctx.replyWithVideo(
            { url: result.data.videoUrl },
            { 
              caption: `📹 ${result.data.title}`,
              parse_mode: 'HTML'
            }
          );
          console.log('✅ Video sent as video message');
        } else {
          // Video >50MB atau tidak bisa diukur, kirim sebagai document
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
        // Jika gagal cek ukuran, kirim sebagai document untuk amannya
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

// ==================== TIKTOK IMAGE DOWNLOAD FUNCTION ====================
async function handleImageDownload(ctx, url) {
  const processingMsg = await ctx.reply('⏳ Sedang memproses gambar...');

  try {
    const result = await downloader.downloadImages(url);
    
    if (result.success) {
      if (result.data.type === 'images' && result.data.images && result.data.images.length > 0) {
        console.log(`🖼️ Sending ${result.data.images.length} images`);
        
        for (let i = 0; i < result.data.images.length; i++) {
          try {
            // Download gambar ke buffer dulu
            console.log(`📥 Downloading image ${i+1} to buffer...`);
            const imageBuffer = await downloadImageToBuffer(result.data.images[i]);
            console.log(`✅ Image ${i+1} downloaded to buffer`);
            
            // Kirim gambar dari buffer
            await ctx.replyWithPhoto(
              { source: imageBuffer },
              { 
                caption: i === 0 ? `📸 ${result.data.title}` : '',
                parse_mode: 'HTML'
              }
            );
            console.log(`✅ Image ${i+1} sent as photo`);
            
          } catch (photoError) {
            console.error(`❌ Error sending image ${i + 1}:`, photoError.message);
            // Jika gagal, coba download ulang dan kirim sebagai document
            try {
              const imageBuffer = await downloadImageToBuffer(result.data.images[i]);
              await ctx.replyWithDocument(
                { source: imageBuffer, filename: `image_${i+1}.jpg` },
                { caption: `📸 ${result.data.title} (Gambar ${i + 1})` }
              );
              console.log(`✅ Image ${i+1} sent as document`);
            } catch (docError) {
              console.error(`❌ Error sending document ${i + 1}:`, docError.message);
              await ctx.reply(`❌ Gagal mengirim gambar ${i + 1}`);
            }
          }
          
          // Delay antara pengiriman gambar
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
