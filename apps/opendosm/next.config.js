const { i18n } = require("./next-i18next.config");
const pwa = require("next-pwa")({
  dest: "public",
  buildExcludes: ["./public/static/images/opendosm-github.png"],
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
  poweredByHeader: false,
  transpilePackages: ["datagovmy-ui"],
  modularizeImports: {
    "datagovmy-ui": {
      transform: "datagovmy-ui/{{member}}",
      preventFullImport: true,
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /index\.(js|mjs|jsx|ts|tsx)$/,
      include: mPath => mPath.includes("datagovmy-ui"),
      sideEffects: false,
    });
    return config;
  },
  publicRuntimeConfig: {
    APP_NAME: "OpenDOSM",
    META_AUTHOR: "Department of Statistics Malaysia",
    META_THEME: "#13293D",
    META_KEYWORDS:
      "dosm kawasanku open data stats statistics malaysia cpi index labor market money supply demand reserve gdp currency",
    META_DOMAIN: "open.dosm.gov.my",
    META_URL: process.env.NEXT_PUBLIC_APP_URL,
    META_IMAGE: `${process.env.NEXT_PUBLIC_APP_URL}/static/images/og_{{lang}}.png`,
  },
  async rewrites() {
    return [
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
};

module.exports = () => {
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
