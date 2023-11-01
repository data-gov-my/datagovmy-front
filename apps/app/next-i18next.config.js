const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "catalogue",
  "community",
  "countries",
  "dashboards",
  "agencies",
  "dashboard-birthday-explorer",
  "dashboard-car-popularity",
  "dashboard-circle-of-life",
  "dashboard-civil-service",
  "dashboard-currency-in-circulation",
  "dashboard-drug-addiction",
  "dashboard-fire-and-rescue",
  "dashboard-flood-warning",
  "dashboard-government-site-tracker",
  "dashboard-immigration",
  "dashboard-income-taxation",
  "dashboard-inisiatif-pendapatan-rakyat",
  "dashboard-interest-rates",
  "dashboard-international-reserves",
  "dashboard-internet-penetration",
  "dashboard-jobless-claims",
  "dashboard-ktmb-explorer",
  "dashboard-money-supply",
  "dashboard-name-popularity",
  "dashboard-orang-asli",
  "dashboard-inisiatif-pendapatan-rakyat",
  "dashboard-poverty",
  "dashboard-public-contracting",
  "dashboard-public-pension",
  "dashboard-public-transportation",
  "dashboard-rapid-explorer",
  "dashboard-refugee-situation",
  "dashboard-reserve-money",
  "dashboard-retirement-readiness",
  "dashboard-sekolahku",
  "dashboard-weather-and-climate",
  "dashboard-household-debt",
  "dashboard-business-creation-destruction",
  "dashboard-electronic-payments",
  "helpdesk",
  "gui",
];

module.exports = defineConfig(namespaces, ["common", "agencies", "dashboards"]);
