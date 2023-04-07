const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en-GB",
    locales: ["en-GB", "ms-MY"],
  },
  load: "all",
  preload: ["en-GB", "ms-MY"],
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: true,
};
