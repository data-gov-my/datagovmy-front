import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Client-side querying for the Rapid Explorer.
 *
 * The dashboard used to give every origin-destination pair its own route, so
 * picking a station meant a navigation and a blocking server render. There are
 * 17,412 valid pairs, so most of those renders were cold. Here the whole daily
 * series lives in one parquet on S3 and the browser reads the few byte ranges
 * it needs with DuckDB-WASM, which also means the page can show all history
 * rather than the rolling 56-day window the dashboard file carries.
 *
 * The file is sorted by (origin, destination, date), so a pair's rows sit
 * together and DuckDB skips almost the entire file from the row-group
 * statistics: roughly one 126 KB row group out of 24 MB per query.
 *
 * Initialisation is deliberately lazy and non-blocking. The landing renders
 * from the default pair's series, which ships in the metadata JSON, so nothing
 * on screen waits for WASM to arrive; it loads in the background and is only
 * needed once someone changes a station.
 */

export const EXPLORER_PARQUET = "https://storage.data.gov.my/dashboards/prasarana_explorer.parquet";

export type Series = { x: number[]; passengers: number[] };
export type PairSeries = { daily: Series; monthly: Series };
export type PairCallout = { daily: number; monthly: number };

export type PairResult = {
  A_to_B: PairSeries;
  B_to_A: PairSeries;
  A_to_B_callout: PairCallout;
  B_to_A_callout: PairCallout;
};

const EMPTY_SERIES: PairSeries = {
  daily: { x: [], passengers: [] },
  monthly: { x: [], passengers: [] },
};

/**
 * Both directions and both frequencies in one round trip.
 *
 * Doing this as a single statement rather than four matters more than it looks:
 * each separate query re-reads the file footer, and the two directions live in
 * different row groups, so batching keeps a station change to one set of range
 * requests instead of four.
 *
 * `epoch_ms` matches what the metadata JSON ships, so a series fetched here and
 * one that arrived in static props are the same shape on the same time scale.
 */
const PAIR_SQL = `
  WITH pair AS (
    SELECT origin, destination, date, passengers
    FROM read_parquet($url)
    WHERE (origin = $a AND destination = $b)
       OR (origin = $b AND destination = $a)
  )
  SELECT
    (origin = $a) AS forward,
    'daily'       AS freq,
    epoch_ms(date::TIMESTAMP)::BIGINT AS x,
    passengers::BIGINT                AS passengers
  FROM pair
  UNION ALL
  SELECT
    (origin = $a),
    'monthly',
    epoch_ms(date_trunc('month', date)::TIMESTAMP)::BIGINT,
    sum(passengers)::BIGINT
  FROM pair
  GROUP BY 1, 2, 3
  ORDER BY freq, forward, x
`;

/** Arrow rows -> the two directions, each with its two frequencies. */
function shape(
  rows: Array<{ forward: boolean; freq: string; x: any; passengers: any }>
): PairResult {
  const build = (): PairSeries => ({
    daily: { x: [], passengers: [] },
    monthly: { x: [], passengers: [] },
  });
  const forward = build();
  const reverse = build();

  for (const row of rows) {
    const target = row.forward ? forward : reverse;
    const series = row.freq === "monthly" ? target.monthly : target.daily;
    series.x.push(Number(row.x));
    series.passengers.push(Number(row.passengers));
  }

  const callout = (s: PairSeries): PairCallout => ({
    daily: s.daily.passengers.at(-1) ?? 0,
    monthly: s.monthly.passengers.at(-1) ?? 0,
  });

  return {
    A_to_B: forward,
    B_to_A: reverse,
    A_to_B_callout: callout(forward),
    B_to_A_callout: callout(reverse),
  };
}

export function useExplorerQuery() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<any>(null);
  // Survives the double-invoked effect that StrictMode runs in development,
  // which would otherwise spin up two workers and leak one.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const duckdb = await import("@duckdb/duckdb-wasm");
        const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());

        const workerUrl = URL.createObjectURL(
          new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
        );
        const worker = new Worker(workerUrl);
        const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        URL.revokeObjectURL(workerUrl);

        if (cancelled) {
          await db.terminate();
          return;
        }

        dbRef.current = db;
        setReady(true);
      } catch (e) {
        // A failure here is not fatal: the landing still renders from static
        // props, and the caller falls back to showing the default pair.
        setError(e instanceof Error ? e.message : "Failed to start DuckDB");
      }
    })();

    return () => {
      cancelled = true;
      dbRef.current?.terminate?.();
      dbRef.current = null;
    };
  }, []);

  const queryPair = useCallback(
    async (origin: string, destination: string): Promise<PairResult> => {
      if (!dbRef.current) throw new Error("DuckDB is not ready");

      const conn = await dbRef.current.connect();
      try {
        const stmt = await conn.prepare(PAIR_SQL);
        const table = await stmt.query({
          url: EXPLORER_PARQUET,
          a: origin,
          b: destination,
        });
        return shape(table.toArray().map((r: any) => r.toJSON?.() ?? r));
      } finally {
        await conn.close();
      }
    },
    []
  );

  return { ready, error, queryPair, EMPTY_SERIES };
}
