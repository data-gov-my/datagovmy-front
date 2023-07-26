const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en-GB",
    locales: ["en-GB", "ms-MY"],
  },
  lng: "en-GB",
  load: "currentOnly",
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: true,
};
