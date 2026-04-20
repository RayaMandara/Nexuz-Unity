// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://nexuz-unity.vercel.app', // Ganti dengan URL Vercel kamu!
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*'], // Jangan sertakan halaman admin di sitemap
};