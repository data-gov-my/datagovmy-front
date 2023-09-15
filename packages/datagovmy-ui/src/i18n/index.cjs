// const I18NextHttpBackend = require("i18next-http-backend/cjs");
const path = require("path");

/** @type {import('next-i18next').UserConfig} */
const defineConfig = (namespace, autoloadNs) => {
  return {
    i18n: {
      defaultLocale: "en-GB",
      locales: ["en-GB", "ms-MY"],
      // backend: {
      //   loadPath: `${process.env.NEXT_PUBLIC_API_URL}/i18n/?lang={{lng}}&filename={{ns}}`,
      //   customHeaders: {
      //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
      //   },
      //   crossDomain: true,
      //   allowMultiLoading: true,
      // },
    },
    localePath: path.resolve("./public/locales"),
    // debug: true,
    ns: namespace,
    autoloadNs: autoloadNs,
    load: "currentOnly",
    preload: ["en-GB", "ms-MY"],
    // serializeConfig: false,
    serializeConfig: true,
    reloadOnPrerender: true,
    // use: [I18NextHttpBackend],
  };
};

module.exports = defineConfig;
