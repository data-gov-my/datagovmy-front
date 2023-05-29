/** @type {import('next').NextConfig} */
const config = {
  i18n: {
    locales: ["en-GB", "ms-MY"],
    defaultLocale: "en-GB",
  },
};

/** @type {import('nextra').NextraConfig} */
const nextra = require("nextra")({
  theme: "datagovmy-nextra",
  themeConfig: "./theme.config.jsx",
});

module.exports = () => {
  const plugins = [nextra]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), config);
};
