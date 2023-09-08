export const routes = {
  HOME: "/",
  KAWASANKU: "/dashboard/kawasanku",
  GDP: "/dashboard/gdp",
  LABOUR_MARKET: "/dashboard/labour-market",
  COMPOSITE_INDEX: "/dashboard/composite-indices",
  WHOLESALE_RETAIL: "/dashboard/wholesale-retail-trade",
  INDUSTRIAL_PRODUCTION: "/dashboard/industrial-production",
  CONSUMER_PRICES: "/dashboard/consumer-prices",
  PRODUCER_PRICES: "/dashboard/producer-prices",
  PUBLICATIONS: "/publications",
  IIP: "/dashboard/international-investment-position",
  LABOUR_PRODUCTIVITY: "dashboard/labour-productivity",
  BOP: "/dashboard/balance-of-payments",
  MANUFACTURING_STATISTICS: "/dashboard/manufacturing-statistics",
  CONSTRUCTION_STATISTICS: "/dashboard/construction-statistics",
  SERVICES_STATISTICS: "/dashboard/services-statistics",
  FORMAL_SECTOR_WAGES: "/dashboard/formal-sector-wages",
  SERVICES_PRODUCER_PRICES: "/dashboard/services-producer-prices",
  POPULATION: "/dashboard/population",
  HOUSEHOLD_INCOME_EXPENDITURE: "/dashboard/household-income-expenditure",
  EXCHANGE_RATES: "/dashboard/exchange-rates",
  EXTERNAL_TRADE: "/dashboard/external-trade",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/data-catalogue"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/ms-MY${route}`);
  });
  return s_routes;
})();
