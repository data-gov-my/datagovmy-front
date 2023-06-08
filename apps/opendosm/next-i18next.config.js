const path = require("path");
module.exports = {
  i18n: {
    defaultLocale: "en-GB",
    locales: ["en-GB", "ms-MY"],
  },
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: true,
};
