module.exports = (bot) => {
  bot.start((ctx) => {
    const welcomeMessage = `
 <b>Bot Downloader Rullxy</b>

<b>Fitur yang tersedia:</b>
• 📹 TikTok video (tanpa watermark)
• 🖼️ TikTok images (slideshow)  
• 🎨 Remove background gambar

<b>Cara penggunaan:</b>
• <b>Video TikTok:</b> Kirim link TikTok
• <b>Gambar TikTok:</b> <code>/image [link_tiktok]</code>
• <b>Remove BG:</b> <code>/removebg</code> lalu kirim gambar

<b>Commands:</b>
/start - Info bot
/help - Bantuan
/removebg - Hapus background gambar
    `;
    ctx.replyWithHTML(welcomeMessage);
  });

  bot.help((ctx) => {
    ctx.replyWithHTML(`
<b>Bantuan Penggunaan</b>

<b>Download TikTok:</b>
Kirim link video/gambar TikTok

<b>Remove Background:</b>
1. Ketik <code>/removebg</code>
2. Kirim gambar/foto
3. Dapatkan gambar tanpa background (PNG)

<b>Supported Image Types:</b>
• JPG, JPEG, PNG
• Max size: 12MB
• Hasil: PNG transparan

<b>Note:</b>
• RemoveBG free: 50 gambar/bulan
• Hasil terbaik: foto orang dengan background kontras
    `);
  });
};
