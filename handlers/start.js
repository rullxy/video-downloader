module.exports = (bot) => {
  bot.start((ctx) => {
    const welcomeMessage = `
🤖 <b>Multi-Platform Downloader Bot</b>

<b>Fitur yang tersedia:</b>
• 📹 TikTok video (tanpa watermark)
• 🖼️ TikTok images (slideshow)

<b>Cara penggunaan:</b>
• <b>Untuk video/gambar:</b> Kirim link saja
• <b>Untuk gambar TikTok:</b> Gunakan <code>/image [link_tiktok]</code>

<b>Contoh:</b>
<code>https://vm.tiktok.com/xxxxx/</code>
<code>/image https://www.tiktok.com/xxxxx</code>

<b>Commands:</b>
/start - Info bot
/help - Bantuan
    `;
    ctx.replyWithHTML(welcomeMessage);
  });

  bot.help((ctx) => {
    ctx.replyWithHTML(`
<b>Bantuan Penggunaan</b>

<b>Download Media:</b>
Kirim link dari platform yang didukung

<b>Download Gambar TikTok:</b>
Gunakan format: <code>/image [link_tiktok]</code>

<b>Supported Platforms:</b>
• TikTok (video & gambar)

<b>Note:</b>
• Video ≤50MB dikirim sebagai video
• Video >50MB dikirim sebagai document
• Pastikan link valid dan konten tidak private
    `);
  });
};
