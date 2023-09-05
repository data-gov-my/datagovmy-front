const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "catalogue",
  "community",
  "countries",
  "dashboards",
  "agencies",
  "dashboard-birthday-explorer",
  "dashboard-blood-donation",
  "dashboard-car-popularity",
  "dashboard-circle-of-life",
  "dashboard-civil-service",
  "dashboard-consumer-prices",
  "dashboard-covid-19",
  "dashboard-covid-vaccination",
  "dashboard-currency-in-circulation",
  "dashboard-election-explorer",
  "dashboard-emergency-response",
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
  "dashboard-jobless-claims",
  "dashboard-ktmb-explorer",
  "dashboard-money-supply",
  "dashboard-name-popularity",
  "dashboard-orang-asli",
  "dashboard-organ-donation",
  "dashboard-peka-b40",
  "dashboard-ipr",
  "dashboard-poverty",
  "dashboard-public-contracting",
  "dashboard-public-pension",
  "dashboard-public-transportation",
  "dashboard-refugee-situation",
  "dashboard-reserve-money",
  "dashboard-retirement-readiness",
  "dashboard-sekolahku",
  "dashboard-weather-and-climate",
  "dashboard-household-debt",
  "dashboard-business-creation-destruction",
  "helpdesk",
];

module.exports = defineConfig(namespaces, ["common", "agencies", "dashboards"]);
