import { useDuckDb as _useDuckDb } from "duckdb-wasm-kit";
import { useData } from "./useData";

export interface DuckDBQuery<T> {
  name: T;
  defaultValue: any;
  filters: string; // e.g. "AND origin = 'KUL' AND destination = 'PEN'"
  select: string; // e.g. "SUM(passengers) AS total"
}

/**
 * DuckDB hook that accepts multiple query definitions
 * and a shared baseQuery with a {{select}} placeholder
 */
export const useDuckDb = <T extends string>(queries: DuckDBQuery<T>[], baseQuery: string) => {
  const { db, loading, error } = _useDuckDb();
  const { data: queryData, setData: setQueryData } = useData(
    queries.reduce(
      (acc, query) => {
        acc[query.name] = query.defaultValue;
        return acc;
      },
      {} as Record<string, any>
    )
  );

  const executeQueries = async () => {
    if (!db || !queries.length) return;

    const connection = await db.connect();
    const startTime = performance.now();

    try {
      const results = await Promise.all(
        queries.map(async query => {
          try {
            // Build full SQL dynamically by injecting SELECT and filters
            const fullQuery =
              baseQuery.replace(/\{\{\s*select\s*\}\}/i, query.select).trim() +
              `\n${query.filters.trim()}`;

            const result = await connection.query(fullQuery);
            return { name: query.name, data: result, success: true };
          } catch (err) {
            console.error(`❌ Query ${query.name} failed:`, err);
            return { name: query.name, error: err, success: false };
          }
        })
      );

      const endTime = performance.now();
      if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
        console.log(`🚀 DuckDB queries completed in ${(endTime - startTime).toFixed(2)}ms`);
      }

      return results;
    } catch (err) {
      console.error("DuckDB execution failed:", err);
      throw err;
    } finally {
      await connection.close();
    }
  };

  return {
    queryData,
    setQueryData,
    executeQueries,
    db,
    loading,
    error,
  };
};
