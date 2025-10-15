export const getTimeseriesData = (params: { origin: string; destination: string }) => {
  return `
    SELECT origin, destination, date, CAST(passengers AS INTEGER) as passengers
    FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
    WHERE origin = '${params.origin}'
    AND destination = '${params.destination}'
    ORDER BY date
    ;
    SELECT ANY_VALUE(origin) as origin, ANY_VALUE(destination) as destination,
           (strftime('%Y-%m', date) || '-01') as date, CAST(SUM(passengers) AS INTEGER) as passengers
    FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
    WHERE origin = '${params.origin}'
    AND destination = '${params.destination}'
    GROUP BY strftime('%Y-%m', date)
    ORDER BY date
  `;
};
