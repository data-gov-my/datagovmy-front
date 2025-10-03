/** @type {import('next').NextConfig} */
const config = {
  i18n: {
    locales: ["en", "ms"],
    defaultLocale: "en",
  },
};

/** @type {import('nextra').NextraConfig} */
const nextra = require("nextra")({
  theme: "datagovmy-nextra",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  latex: true,
  flexsearch: {
    codeblock: false,
  },
});

module.exports = () => {
  const plugins = [nextra]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), config);
};
