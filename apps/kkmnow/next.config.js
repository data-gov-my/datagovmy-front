/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const pwa = require("next-pwa")({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
  poweredByHeader: false,
  transpilePackages: ["datagovmy-ui"],
  publicRuntimeConfig: {
    APP_NAME: "KKMNOW",
    META_AUTHOR: "Ministry of Health & Department of Statistics Malaysia",
    META_THEME: "#13293D",
    META_KEYWORDS:
      "kkmnow kementerian data kesihatan covidnow statistics malaysia blood organ donation vaccination vaccine b40 health ",
    META_DOMAIN: "data.moh.gov.my",
    META_URL: "https://data.moh.gov.my",
    META_IMAGE: "https://data.moh.gov.my/static/images/jata_512.png",
  },
};

module.exports = () => {
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
