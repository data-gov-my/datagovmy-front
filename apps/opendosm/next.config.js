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
  publicRuntimeConfig: {
    APP_NAME: "OpenDOSM",
    META_AUTHOR: "Department of Statistics Malaysia",
    META_THEME: "#13293D",
    META_KEYWORDS:
      "dosm kawasanku open data stats statistics malaysia cpi index labor market money supply demand reserve gdp currency",
    META_DOMAIN: "open.dosm.gov.my",
    META_URL: "https://open.dosm.gov.my",
    META_IMAGE: "https://open.dosm.gov.my/static/images/jata_512.png",
  },
};

module.exports = () => {
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
