/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa")({
  dest: "public",
  buildExcludes: ["./public/static/images/opendosm-github.png"],
});

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
          register: true,
          skipWaiting: true,
        },
      },
    ],
  ],
  {
    i18n,
    reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
    poweredByHeader: false,
  }
);
