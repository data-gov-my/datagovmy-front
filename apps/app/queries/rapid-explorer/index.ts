import { QueriesStatement } from "datagovmy-ui/src/hooks/useDuckDb";

export const getTimeseriesData = (params: {
  origin: string;
  destination: string;
}): QueriesStatement => {
  return {
    query: `
      SELECT origin, destination, date, CAST(passengers AS INTEGER) as passengers
      FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
      WHERE origin = ?
      AND destination = ?
      ORDER BY date
      ;
    `,
    params: [params.origin, params.destination],
  };
};

export const getTimeseriesDataMonthly = (params: {
  origin: string;
  destination: string;
}): QueriesStatement => {
  return {
    query: `
      SELECT ANY_VALUE(origin) as origin, ANY_VALUE(destination) as destination,
             (strftime('%Y-%m', date) || '-01') as date, CAST(SUM(passengers) AS INTEGER) as passengers
      FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
      WHERE origin = ?
      AND destination = ?
      GROUP BY strftime('%Y-%m', date)
      ORDER BY date
    `,
    params: [params.origin, params.destination],
  };
};
