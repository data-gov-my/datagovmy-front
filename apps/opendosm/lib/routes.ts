export const routes = {
  HOME: "/",
  BOP: "/dashboard/balance-of-payments",
  COMPOSITE_INDEX: "/dashboard/composite-indices",
  CONSUMER_PRICES: "/dashboard/consumer-prices",
  CONSTRUCTION_STATISTICS: "/dashboard/construction-statistics",
  EXCHANGE_RATES: "/dashboard/exchange-rates",
  FORMAL_SECTOR_WAGES: "/dashboard/formal-sector-wages",
  EXTERNAL_TRADE: "/dashboard/external-trade",
  GDP: "/dashboard/gdp",
  HOUSEHOLD_INCOME_EXPENDITURE: "/dashboard/household-income-expenditure",
  LABOUR_PRODUCTIVITY: "dashboard/labour-productivity",
  IIP: "/dashboard/international-investment-position",
  INDUSTRIAL_PRODUCTION: "/dashboard/industrial-production",
  KAWASANKU: "/dashboard/kawasanku",
  LABOUR_MARKET: "/dashboard/labour-market",
  MANUFACTURING_STATISTICS: "/dashboard/manufacturing-statistics",
  POPULATION: "/dashboard/population",
  PRODUCER_PRICES: "/dashboard/producer-prices",
  PUBLICATIONS: "/publications",
  SERVICES_STATISTICS: "/dashboard/services-statistics",
  SERVICES_PRODUCER_PRICES: "/dashboard/services-producer-prices",
  WHOLESALE_RETAIL: "/dashboard/wholesale-retail-trade",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/data-catalogue"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/ms-MY${route}`);
  });
  return s_routes;
})();
