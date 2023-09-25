const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "agencies",
  "division",
  "dashboards",
  "dashboard-bop",
  "dashboard-composite-index",
  "dashboard-consumer-prices",
  "dashboard-construction-statistics",
  "dashboard-household-income-expenditure",
  "dashboard-iip",
  "dashboard-industrial-production",
  "dashboard-gdp",
  "dashboard-kawasanku",
  "dashboard-labour-market",
  "dashboard-life-expectancy",
  "dashboard-manufacturing-statistics",
  "dashboard-producer-prices",
  "dashboard-wholesale-retail",
  "division",
  "opendosm-home",
  "publications",
  "dashboard-labour-productivity",
  "dashboard-formal-sector-wages",
  "dashboard-services-statistics",
  "dashboard-services-producer-prices",
  "dashboard-population",
  "dashboard-exchange-rates",
  "dashboard-external-trade",
];

module.exports = defineConfig(namespaces, ["common", "agencies", "division", "dashboards"]);
