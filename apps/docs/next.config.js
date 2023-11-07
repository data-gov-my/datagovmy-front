/** @type {import('next').NextConfig} */
const config = {
  i18n: {
    locales: ["en", "ms"],
    defaultLocale: "en",
  },
  async rewrites() {
    return [
      {
        source: "/mp/lib.min.js",
        destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js",
      },
      {
        source: "/mp/lib.js",
        destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.js",
      },
      {
        source: "/mp/decide",
        destination: "https://decide.mixpanel.com/decide",
      },
      {
        source: "/mp/:slug*",
        destination: "https://api.mixpanel.com/:slug*",
      },
    ];
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
