/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.APP_URL || "https://open.dosm.gov.my",
  generateIndexSitemap: true,
  generateRobotsTxt: true,
  priority: 0.7,
  autoLastmod: true,
  outDir: "public",
  exclude: ["/404", "/ms-MY/404", "500", "/ms-MY/500"],
};
