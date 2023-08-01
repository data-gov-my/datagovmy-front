const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "agencies",
  "dashboard-blood-donation",
  "dashboard-covid-19",
  "dashboard-covid-vaccination",
  "dashboard-hospital-bed-utilisation",
  "dashboard-organ-donation",
  "dashboard-peka-b40",
];

module.exports = defineConfig(namespaces, ["common", "agencies", "dashboards"]);
