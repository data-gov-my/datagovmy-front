const defineConfig = require("datagovmy-ui/i18n");

const namespaces = ["common", "catalogue", "countries", "agencies", "validations"];

module.exports = defineConfig(namespaces, ["common", "agencies", "dashboards", "validations"]);
