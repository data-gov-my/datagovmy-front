/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.APP_URL || "https://developer.data.gov.my",
  generateIndexSitemap: true,
  generateRobotsTxt: true,
  priority: 0.7,
  autoLastmod: true,
  outDir: "public",
  exclude: ["/404", "/ms/404", "500", "/ms/500"],
};
