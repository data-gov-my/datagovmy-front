const I18NextHttpBackend = require("i18next-http-backend");
const lang_map = {
  "en-GB": "en",
  "en": "en",
  "ms-MY": "bm",
  "ms": "bm",
};
const namespace = [
  "common",
  "dashboard-999-tracker",
  "dashboard-birthday-explorer",
  "dashboard-blood-donation",
  "dashboard-car-popularity",
  "dashboard-circle-of-life",
  "dashboard-civil-service",
  "dashboard-consumer-prices",
  "dashboard-covid-19",
  "dashboard-covid-vaccination",
  "dashboard-covid-currency-in-circulation",
  "dashboard-election-explorer",
  "dashboard-exchange-rates",
  "dashboard-fire-and-rescue",
  "dashboard-flood-warning",
  "dashboard-gdp",
  "dashboard-government-site-tracker",
  "dashboard-hospital-bed-utilisation",
  "dashboard-immigration",
  "dashboard-income-taxation",
  "dashboard-interest-rates",
  "dashboard-international-reserves",
  "dashboard-internet-penetration",
  "dashboard-money-supply",
  "dashboard-name-popularity",
  "dashboard-organ-donation",
  "dashboard-peka-b40",
  "dashboard-peoples-income-initiative",
  "dashboard-poverty",
  "dashboard-public-contracting",
  "dashboard-public-pension",
  "dashboard-public-transportation",
  "dashboard-reserve-money",
  "dashboard-retirement-readiness",
  "dashboard-sekolahku",
  "dashboard-social-security",
  "dashboard-weather-and-climate",
];

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en-GB",
    locales: ["en-GB", "ms-MY"],
    backend: {
      loadPath: (lang, namespace) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/i18n?lang=${lang_map[lang]}&filename=${namespace}.json`;
      },
      parse: data => {
        const _data = JSON.parse(data).translation_json;
        return _data;
      },
      customHeaders: {
        Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
      },
    },
  },
  ns: namespace,
  load: "currentOnly",
  preload: ["en-GB", "ms-MY"],
  serializeConfig: false,
  reloadOnPrerender: true,
  use: [I18NextHttpBackend],
  react: {
    bindI18n: "languageChanged loaded",
    bindI18nStore: "languageChanged loaded",
    useSuspense: true,
  },
};
