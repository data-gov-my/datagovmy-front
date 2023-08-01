const { i18n } = require("./next-i18next.config");

/**
 * Plugins / Constants
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
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/dashboard/election-explorer",
        destination: "/dashboard/election-explorer/elections",
      },
      {
        source: "/dashboard/income-taxation",
        destination: "/dashboard/income-taxation/overview",
      },
      {
        source: "/mp/lib.min.js",
        destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js",
      },
      {
        source: "/mp/lib.js",
        destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.js",
      },
      {
        source: "/mp/decide",
        destination: "https://decide.mixpanel.com/decide",
      },
      {
        source: "/mp/:slug*",
        destination: "https://api.mixpanel.com/:slug*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = () => {
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
