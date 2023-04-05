/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

/**
 * Plugins
 */
const analyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE ?? false,
});
const pwa = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: ["./public/static/images/opendosm-github.png"],
});

/**
 * Next Config
 */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = () => {
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
