const I18NextHttpBackend = require("i18next-http-backend/cjs");
// const path = require("path");

/** @type {import('next-i18next').UserConfig} */
const defineConfig = (namespace, autoloadNs) => {
  return {
    i18n: {
      defaultLocale: "en-GB",
      locales: ["en-GB", "ms-MY"],
      // USE THIS for local translation file
      // localePath:
      //   typeof window === "undefined"
      //     ? require("path").resolve("./public/translations")
      //     : "./public/translations",
    },
    backend: {
      loadPath: `${process.env.NEXT_PUBLIC_I18N_URL}/${
        process.env.NEXT_PUBLIC_APP_ENV === "production" ? "production" : "staging"
      }/{{lng}}/{{ns}}.json`,
      crossDomain: true,
      allowMultiLoading: true,
    },
    debug: false,
    ns: namespace,
    autoloadNs: autoloadNs,
    load: "currentOnly",
    preload: ["en-GB", "ms-MY"],
    serializeConfig: false,
    reloadOnPrerender: true,
    // COMMENT this line to use local translation
    use: [I18NextHttpBackend],
  };
};

module.exports = defineConfig;
