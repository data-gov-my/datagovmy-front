const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "agencies",
  "dashboards",
  "dashboard-bop",
  "dashboard-composite-index",
  "dashboard-consumer-prices",
  "dashboard-construction-statistics",
  "dashboard-iip",
  "dashboard-industrial-production",
  "dashboard-gdp",
  "dashboard-kawasanku",
  "dashboard-labour-market",
  "dashboard-manufacturing-statistics",
  "dashboard-producer-prices",
  "dashboard-wholesale-retail",
  "opendosm-home",
  "publications",
  "dashboard-labour-productivity",
  "dashboard-formal-sector-wages",
  "dashboard-services-producer-prices",
];

module.exports = defineConfig(namespaces, ["common", "agencies", "dashboards"]);
