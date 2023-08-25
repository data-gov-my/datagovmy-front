const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "agencies",
  "dashboards",
  "dashboard-composite-index",
  "dashboard-consumer-prices",
  "dashboard-industrial-production",
  "dashboard-manufacturing-statistics",
  "dashboard-gdp",
  "dashboard-kawasanku",
  "dashboard-labour-market",
  "dashboard-producer-prices",
  "dashboard-wholesale-retail",
  "dashboard-iip",
  "dashboard-bop",
  "publications",
];

module.exports = defineConfig(namespaces, ["common", "agencies", "dashboards"]);
