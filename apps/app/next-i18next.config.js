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
  "dashboard-vehicle-registrations",
  "dashboard-weather-and-climate",
  "dashboard-household-debt",
  "dashboard-business-creation-destruction",
  "dashboard-electronic-payments",
  "helpdesk",
  "gui-data-catalogue",
  "community-products",
  "data-request",
  "odin",
  "validations",
];

const config = defineConfig(namespaces, ["common", "agencies", "dashboards", "validations"]);

if (process.env.NEXT_PUBLIC_I18N_FORMAT === "meta") {
  const baseUrl = (process.env.NEXT_PUBLIC_I18N_URL || "").replace(/\/+$/, "");
  config.backend = {
    ...config.backend,
    // Browser requests use the app's proxy; the static meta server needs no CORS setup.
    loadPath:
      typeof window === "undefined"
        ? `${baseUrl}/i18n/{{lng}}/{{ns}}.json`
        : "/_meta-i18n/{{lng}}/{{ns}}.json",
    parse: data => JSON.parse(data).translation,
    requestOptions: { cache: "no-store" },
  };
}

module.exports = config;
