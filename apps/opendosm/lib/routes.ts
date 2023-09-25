export const routes = {
  HOME: "/",
  DB_INDEX: "/dashboard",
  BOP: "/dashboard/balance-of-payments",
  COMPOSITE_INDEX: "/dashboard/composite-indices",
  CONSTRUCTION_STATISTICS: "/dashboard/construction-statistics",
  CONSUMER_PRICES: "/dashboard/consumer-prices",
  EXCHANGE_RATES: "/dashboard/exchange-rates",
  EXTERNAL_TRADE: "/dashboard/external-trade",
  FORMAL_SECTOR_WAGES: "/dashboard/formal-sector-wages",
  GDP: "/dashboard/gdp",
  HOUSEHOLD_INCOME_EXPENDITURE: "/dashboard/household-income-expenditure",
  INDUSTRIAL_PRODUCTION: "/dashboard/industrial-production",
  IIP: "/dashboard/international-investment-position",
  KAWASANKU: "/dashboard/kawasanku",
  LABOUR_MARKET: "/dashboard/labour-market",
  LABOUR_PRODUCTIVITY: "/dashboard/labour-productivity",
  LIFE_EXPECTANCY: "/dashboard/life-expectancy",
  MANUFACTURING_STATISTICS: "/dashboard/manufacturing-statistics",
  POPULATION: "/dashboard/population",
  PRODUCER_PRICES: "/dashboard/producer-prices",
  SERVICES_PRODUCER_PRICES: "/dashboard/services-producer-prices",
  SERVICES_STATISTICS: "/dashboard/services-statistics",
  WHOLESALE_RETAIL: "/dashboard/wholesale-retail-trade",
  PUBLICATIONS: "/publications",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(
    route => !["/data-catalogue", "/publications"].includes(route)
  );

  s_routes.forEach(route => {
    s_routes.push(`/ms-MY${route}`);
  });
  return s_routes;
})();
