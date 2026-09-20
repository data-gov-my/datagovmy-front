import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Client-side querying for the KTMB Explorer.
 *
 * The dashboard used to give every origin-destination pair its own route, so
 * picking a station meant a navigation and a blocking server render -- three
 * backend calls per change, since the dropdown tree was refetched alongside
 * both directions. Here the whole daily series lives in one parquet on S3 and
 * the browser reads the few byte ranges it needs with DuckDB-WASM, which also
 * means the page can show all history back to 2020-10-15 rather than the
 * rolling 8-week daily window the dashboard file carries.
 *
 * The file is sorted by (service, origin, destination, date), so a pair's rows
 * sit together and DuckDB skips almost the entire file from the row-group
 * statistics: 3 row groups out of 119, roughly 370 KB of 7.1 MB.
 *
 * Initialisation is deliberately lazy and non-blocking. The landing renders
 * from the default pair's series, which ships in the metadata JSON, so nothing
 * on screen waits for WASM to arrive; it loads in the background and is only
 * needed once someone changes a station.
 */

export const EXPLORER_PARQUET = "https://storage.data.gov.my/dashboards/ktmb_explorer.parquet";

/**
 * DuckDB itself is self-hosted beside the data rather than pulled from
 * jsDelivr and extensions.duckdb.org, so the explorer depends on one origin we
 * control. These are the same files the Rapid explorer loads, already
 * Brotli-compressed on S3, which takes the engine from 34 MB to 5 MB.
 *
 * Both paths are tied to the exact package version: `1.32.0` is the
 * @duckdb/duckdb-wasm release, and `v1.4.3` the DuckDB core inside it, which is
 * where the engine looks for extensions. Upgrading the package means uploading
 * a new set of files under new folders, so the pin in package.json is exact.
 */
const DUCKDB_HOST = "https://storage.data.gov.my/duckdb-wasm";
const DUCKDB_BUNDLES = {
  mvp: {
    mainModule: `${DUCKDB_HOST}/1.32.0/duckdb-mvp.wasm`,
    mainWorker: `${DUCKDB_HOST}/1.32.0/duckdb-browser-mvp.worker.js`,
  },
  eh: {
    mainModule: `${DUCKDB_HOST}/1.32.0/duckdb-eh.wasm`,
    mainWorker: `${DUCKDB_HOST}/1.32.0/duckdb-browser-eh.worker.js`,
  },
};
const DUCKDB_EXTENSIONS = `${DUCKDB_HOST}/extensions`;

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
    SELECT (origin = ?) AS forward, date, passengers
    FROM read_parquet(?)
    WHERE service = ?
      AND origin IN (?, ?) AND destination IN (?, ?)
      AND ((origin = ? AND destination = ?) OR (origin = ? AND destination = ?))
  )
  SELECT
    forward,
    'daily' AS freq,
    epoch_ms(date::TIMESTAMP)::BIGINT AS x,
    passengers::BIGINT                AS passengers
  FROM pair
  UNION ALL
  SELECT
    forward,
    'monthly',
    epoch_ms(date_trunc('month', date)::TIMESTAMP)::BIGINT,
    sum(passengers)::BIGINT
  FROM pair
  GROUP BY 1, 2, 3
  ORDER BY freq, forward, x
`;

/**
 * Values for PAIR_SQL's `?` placeholders, in the order they appear.
 *
 * `AsyncPreparedStatement.query` is `(...params: any[])` -- positional only.
 * Passing an object to bind `$name` parameters instead fails at runtime with
 * "Invalid column type encountered for argument 0", because the object itself
 * is bound as the first parameter.
 *
 * The station names repeat because the predicate has to name them literally:
 * lifting them into a CTE and joining would bind each once, but the filter
 * would then compare against a runtime column rather than a constant, and
 * DuckDB could no longer prune row groups from the parquet statistics.
 *
 * The `IN` pair is what makes pruning happen at all. The exact match, an OR of
 * two ANDs across two columns, cannot be pushed into the parquet scan, so on
 * its own it reads all 14.6M rows (the whole file). Per-column `IN` filters can
 * be pushed down and checked against each row group's min/max, so the scan
 * touches ~3 of 119 row groups; the exact match then drops the rows that pair
 * the two stations the wrong way round. `service` leads the sort key, so it
 * prunes first and hardest.
 */
const pairParams = (url: string, service: string, origin: string, destination: string) => [
  origin, // forward flag
  url, // read_parquet
  service, // service =
  origin, // origin IN
  destination,
  origin, // destination IN
  destination,
  origin, // A -> B
  destination,
  destination, // B -> A
  origin,
];

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

/**
 * Pay the one-off costs before anyone asks for a pair.
 *
 * Instantiating DuckDB is not enough to make the first query fast. That query
 * also downloads the parquet extension and reads the file footer (a HEAD plus a
 * GET), and only then fetches the row group it wants -- so the first station
 * change was carrying three round trips the rest never pay.
 *
 * `count(*)` over a parquet is answered from the footer's row counts alone, so
 * this loads the extension and caches the metadata without pulling any row
 * group. The landing renders from static props and needs none of this, which
 * makes the seconds a reader spends getting their bearings exactly the right
 * time to spend on it.
 */
async function warmUp(db: any) {
  const conn = await db.connect();
  try {
    // Parquet is not built into the WASM engine; it is fetched on first use.
    // `autoinstall_` covers that implicit fetch, `custom_` an explicit INSTALL.
    await conn.query(`SET autoinstall_extension_repository = '${DUCKDB_EXTENSIONS}'`);
    await conn.query(`SET custom_extension_repository = '${DUCKDB_EXTENSIONS}'`);
    await conn.query(`SELECT count(*) FROM read_parquet('${EXPLORER_PARQUET}')`);
  } catch {
    // Warming is an optimisation; a failure here must not stop the page from
    // querying normally later.
  } finally {
    await conn.close();
  }
}

export function useExplorerQuery() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<any>(null);

  /**
   * Start DuckDB once per mount.
   *
   * Deliberately no "already started" ref. StrictMode double-invokes this in
   * development -- mount, clean up, mount again -- and a ref guard interacts
   * with the cancellation flag to fatal effect: the first pass sets the guard
   * and is then cancelled, the second returns early because the guard is set,
   * and the first pass terminates itself on seeing `cancelled` without ever
   * calling `setReady`. The result is a database that loads its WASM, shuts
   * itself down, and leaves `ready` false forever, so no query ever runs.
   *
   * Letting both passes run is correct instead: the cancelled one terminates
   * the instance it created, the surviving one becomes the connection. The
   * cost is one extra instantiate in development only.
   */
  useEffect(() => {
    let cancelled = false;
    let instance: any = null;

    (async () => {
      try {
        const duckdb = await import("@duckdb/duckdb-wasm");
        const bundle = await duckdb.selectBundle(DUCKDB_BUNDLES);

        const workerUrl = URL.createObjectURL(
          new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
        );
        const worker = new Worker(workerUrl);
        const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        // Without an explicit filesystem config DuckDB never sends a Range
        // header and downloads the whole parquet on first read. These settings
        // make it probe with a one-byte range, which CloudFront answers with
        // 206, and read byte ranges from then on. `reliableHeadRequests` stays
        // off because CloudFront answers a ranged HEAD with 200, not 206.
        await db.open({
          filesystem: {
            allowFullHTTPReads: true,
            reliableHeadRequests: false,
            forceFullHTTPReads: false,
          },
        });
        URL.revokeObjectURL(workerUrl);
        instance = db;

        if (cancelled) {
          await db.terminate();
          return;
        }

        await warmUp(db);
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
      // Only tear down what this pass created; a later pass owns whatever is
      // in the ref by then.
      instance?.terminate?.();
      if (dbRef.current === instance) {
        dbRef.current = null;
        setReady(false);
      }
    };
  }, []);

  const queryPair = useCallback(
    async (service: string, origin: string, destination: string): Promise<PairResult> => {
      if (!dbRef.current) throw new Error("DuckDB is not ready");

      const conn = await dbRef.current.connect();
      try {
        const stmt = await conn.prepare(PAIR_SQL);
        const table = await stmt.query(
          ...pairParams(EXPLORER_PARQUET, service, origin, destination)
        );
        return shape(table.toArray().map((r: any) => r.toJSON?.() ?? r));
      } finally {
        await conn.close();
      }
    },
    []
  );

  return { ready, error, queryPair, EMPTY_SERIES };
}
