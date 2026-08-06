import { useDuckDb as _useDuckDb } from "duckdb-wasm-kit";
import { useData } from "./useData";

export interface DuckDBQuery<T> extends QueriesStatement {
  name: T;
  defaultValue: any;
}

// For DuckDB query
export type QueriesStatement = {
  query: string;
  params?: string[];
};

/**
 * DuckDB hook for executing multiple SQL queries asynchronously.
 *
 * @template T - Union type of query name keys (e.g., "forward" | "reverse")
 * @param queries - Array of query configurations with name, defaultValue, and full SQL query
 * @returns Object containing queryData state, setQueryData updater, executeQuery function, executeQueries function, db instance, loading state, and error state
 *
 * @example
 * ```typescript
 * type QueryKeys = "users" | "stats";
 *
 * const queries: DuckDBQuery<QueryKeys>[] = [
 *   { name: "users", defaultValue: [], query: "SELECT * FROM users" },
 *   { name: "stats", defaultValue: {}, query: "SELECT COUNT(*) as count FROM users" }
 * ];
 *
 * const { queryData, executeQuery, executeQueries, loading } = useDuckDb<QueryKeys>(queries);
 *
 * // Execute all configured queries
 * await executeQueries();
 *
 * // Execute a single ad-hoc query
 * const result = await executeQuery("SELECT COUNT(*) FROM users");
 * ```
 */
export const useDuckDb = <T extends string>(
  queries: DuckDBQuery<T>[],
  verbose: boolean = process.env.NEXT_PUBLIC_APP_ENV !== "production"
) => {
  const { db, loading, error } = _useDuckDb();
  const {
    data: queryData,
    setData: setQueryData,
    reset,
  } = useData(
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
      const resultsObject = await queries.reduce(
        async (accPromise, query) => {
          const acc = await accPromise;
          try {
            let result;
            if (query.params && query.params.length > 0) {
              const stmt = await connection.prepare(query.query);
              result = await stmt.query(...query.params);
              await stmt.close();
            } else {
              result = await connection.query(query.query);
            }
            acc[query.name] = result;
            return acc;
          } catch (err) {
            acc[query.name] = null;
            return acc;
          }
        },
        Promise.resolve({} as Record<string, any>)
      );

      reset(resultsObject);

      const endTime = performance.now();
      if (verbose) {
        console.log(`🚀 DuckDB queries completed in ${(endTime - startTime).toFixed(2)}ms`);
      }
    } catch (err) {
      console.error("DuckDB execution failed:", err);
      throw err;
    } finally {
      await connection.close();
    }
  };

  const executeQuery = async (query: string, params?: any[], key?: string) => {
    if (!db) return null;

    const connection = await db.connect();
    const startTime = performance.now();

    try {
      let result;
      if (params && params.length > 0) {
        const stmt = await connection.prepare(query);
        result = await stmt.query(...params);
        await stmt.close();
      } else {
        result = await connection.query(query);
      }
      const endTime = performance.now();
      if (verbose) {
        console.log(`🚀 DuckDB queries completed in ${(endTime - startTime).toFixed(2)}ms`);
      }
      if (key) {
        setQueryData(key, result);
      }
      return result;
    } catch (err) {
      console.error("DuckDB query execution failed:", err);
      throw err;
    } finally {
      await connection.close();
    }
  };

  return {
    queryData,
    setQueryData,
    reset,
    executeQuery,
    executeQueries,
    db,
    loading,
    error,
  };
};
