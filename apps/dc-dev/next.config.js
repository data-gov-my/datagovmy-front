const { i18n } = require("./next-i18next.config");

/**
 * Plugins / Constants
 */
const analyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE ?? false,
});

/**
 * Next Config
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["datagovmy-ui"],
  modularizeImports: {
    "datagovmy-ui": {
      transform: "datagovmy-ui/{{member}}",
      preventFullImport: true,
    },
  },
  publicRuntimeConfig: {
    APP_NAME: "dev.data.gov.my",
    META_AUTHOR: "Government of Malaysia",
    META_THEME: "#13293D",
    META_KEYWORDS: "open data statistics malaysia",
    META_DOMAIN: "dev.data.gov.my",
    META_URL: process.env.NEXT_PUBLIC_APP_URL,
    META_IMAGE: `${process.env.NEXT_PUBLIC_APP_URL}/static/images/og_{{lang}}.png`,
  },
  webpack(config) {
    config.module.rules.push({
      test: /index\.(js|mjs|jsx|ts|tsx)$/,
      include: mPath => mPath.includes("datagovmy-ui"),
      sideEffects: false,
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.data.gov.my",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = () => {
  const plugins = []; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
