export const routes = {
  HOME: "/",
  COMMUNITY: "/community",
  DATA_CATALOGUE: "/data-catalogue",
  DATA_GPT: "/data-catalogue/datagpt",
  DASHBOARD: "/dashboard",
  HELPDESK: "/helpdesk",
  BIRTHDAY_EXPLORER: "/dashboard/birthday-explorer",
  BLOOD_DONATION: "/dashboard/blood-donation",
  BUSINESS_CREATION_DESTRUCTION: "/dashboard/business-creation-destruction",
  CAR_POPULARITY: "/dashboard/car-popularity",
  CIRCLE_OF_LIFE: "/dashboard/circle-of-life",
  CIVIL_SERVICE: "/dashboard/civil-service",
  CONSUMER_PRICES: "/dashboard/consumer-prices",
  COVID_19: "/dashboard/covid-19",
  COVID_VACCINATION: "/dashboard/covid-vaccination",
  CRIME: "/dashboard/crime",
  CURRENCY_IN_CIRCULATION: "/dashboard/currency-in-circulation",
  DRUG_ADDICTION: "/dashboard/drug-addiction",
  ELECTRONIC_PAYMENTS: "/dashboard/electronic-payments",
  EMERGENCY_RESPONSE: "/dashboard/emergency-response",
  FIRE_RESCUE: "/dashboard/fire-and-rescue",
  FLOOD_WARNING: "/dashboard/flood-warning",
  GDP: "/dashboard/gdp",
  GOVERNMENT_SITE_TRACKER: "/dashboard/government-site-tracker",
  HOSPITAL_BED_UTILISATION: "/dashboard/hospital-bed-utilisation",
  HOUSEHOLD_DEBT: "/dashboard/household-debt",
  IMMIGRATION: "/dashboard/immigration",
  INCOME_TAXATION: "/dashboard/income-taxation",
  INISIATIF_PENDAPATAN_RAKYAT: "/dashboard/inisiatif-pendapatan-rakyat",
  INTEREST_RATES: "/dashboard/interest-rates",
  INTERNATIONAL_RESERVES: "/dashboard/international-reserves",
  INTERNET_PENETRATION: "/dashboard/internet-penetration",
  JOBLESS_CLAIMS: "/dashboard/jobless-claims",
  KTMB_EXPLORER: "/dashboard/ktmb-explorer",
  MONEY_SUPPLY: "/dashboard/money-supply",
  NAME_POPULARITY: "/dashboard/name-popularity",
  ORANG_ASLI: "/dashboard/orang-asli",
  ORGAN_DONATION: "/dashboard/organ-donation",
  PASSPORT_AND_PASSES: "/dashboard/passport-and-passes",
  PEKA_B40: "/dashboard/peka-b40",
  POVERTY: "/dashboard/poverty",
  PRASARANA_EXPLORER: "/dashboard/prasarana-explorer",
  PUBLIC_CONTRACTING: "/dashboard/public-contracting",
  PUBLIC_PENSION: "/dashboard/public-pension",
  PUBLIC_TRANSPORTATION: "/dashboard/public-transportation",
  REFUGEE_SITUATION: "/dashboard/refugee-situation",
  RESERVE_MONEY: "/dashboard/reserve-money",
  RETIREMENT_READINESS: "/dashboard/retirement-readiness",
  SEKOLAHKU: "/dashboard/sekolahku",
  WEATHER_CLIMATE: "/dashboard/weather-and-climate",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/data-catalogue"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/ms-MY${route}`);
  });
  return s_routes;
})();
