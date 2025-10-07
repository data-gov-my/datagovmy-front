import { useDuckDb as _useDuckDb } from "duckdb-wasm-kit";
import { useData } from "./useData";

/**
 * Query configuration for DuckDB
 */
export interface DuckDBQuery {
  name: string;
  defaultValue: any;
  query: string;
}

/**
 * Enhanced useDuckDb hook with better error handling and data management
 */
export const useDuckDb = (queries: DuckDBQuery[]) => {
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

  /**
   * Execute all queries and return the query data in default Arrow
   */
  const executeQueries = async () => {
    if (!db || !queries.length) return;

    try {
      const connection = await db.connect();
      const startTime = performance.now();

      const results = await Promise.all(
        queries.map(async query => {
          try {
            const result = await connection.query(query.query);
            return { name: query.name, data: result, success: true };
          } catch (err) {
            console.error(`Query ${query.name} failed:`, err);
            return { name: query.name, error: err, success: false };
          }
        })
      );

      const endTime = performance.now();
      if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
        console.log(`🚀 DuckDB queries completed in ${(endTime - startTime).toFixed(2)}ms`);
      }

      await connection.close();
      return results;
    } catch (err) {
      console.error("DuckDB execution failed:", err);
      throw err;
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
