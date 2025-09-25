import Layout from "@components/Layout";
import RapidExplorerDashboard from "@dashboards/transportation/rapid-explorer";
import { get } from "datagovmy-ui/api";
import { Container, Metadata, Spinner } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { useTranslation as _useTranslation } from "next-i18next";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";

const RapidExplorer: Page = ({
  meta,
  A_to_B,
  A_to_B_callout,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  next_update,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-rapid-explorer");
  const [forward, setForward] = useState<any>();
  const [reverse, setReverse] = useState<any>();
  const [forwardCallout, setForwardCallout] = useState<any>();
  const [reverseCallout, setReverseCallout] = useState<any>();

  const { db, loading, error } = useDuckDb();

  const executeQuery = async () => {
    try {
      if (db) {
        const startTime = performance.now();
        const connection = await db.connect();
        const [forwardResult, reverseResult, forwardTotalResult, reverseTotalResult] =
          await Promise.all([
            // Query 1: Origin → Destination
            connection.query(`
          SELECT
            origin,
            destination,
            date,
            passengers
          FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
          WHERE origin = '${params.origin}'
            AND destination = '${params.destination}'
          ORDER BY date ASC
        `),

            // Query 2: Destination → Origin (reverse direction)
            connection.query(`
          SELECT
            origin,
            destination,
            date,
            passengers
          FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
          WHERE origin = '${params.destination}'
            AND destination = '${params.origin}'
          ORDER BY date ASC
        `),

            // Query 3: Total passengers for current month forward
            connection.query(`
          SELECT SUM(passengers) as total
          FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
          WHERE origin = '${params.origin}'
            AND destination = '${params.destination}'
            AND date >= '2025-09-01'
            AND date <= '2025-09-30'
        `),

            // Query 4: Total passengers for current month reverse
            connection.query(`
          SELECT SUM(passengers) as total
          FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
          WHERE origin = '${params.destination}'
            AND destination = '${params.origin}'
            AND date >= '2025-09-01'
            AND date <= '2025-09-30'
        `),
          ]);

        const endTime = performance.now();
        const totalInitTime = endTime - startTime;
        console.log(`🚀 DuckDB query in ${totalInitTime.toFixed(2)}ms`);

        if (forwardResult && forwardResult.numRows > 0) {
          const rows = forwardResult.toArray();
          const data = rows.map(row => ({
            origin: row.origin,
            destination: row.destination,
            date: row.date,
            passengers: Number(row.passengers),
          }));

          setForward({
            data_as_of: "2025-09-24 23:59",
            data: {
              daily: {
                passengers: data.map(row => row.passengers),
                x: data.map(row => row.date),
              },
              monthly: {
                passengers: data.map(row => row.passengers),
                x: data.map(row => row.date),
              },
            },
          });

          if (forwardTotalResult && forwardTotalResult.numRows > 0) {
            const total = forwardTotalResult.toArray()[0].total[0];
            setForwardCallout({
              daily: data[data.length - 1].passengers,
              monthly: total,
            });
          }
        }
        if (reverseResult && reverseResult.numRows > 0) {
          const rows = reverseResult.toArray();
          const data = rows.map(row => ({
            origin: row.origin,
            destination: row.destination,
            date: row.date,
            passengers: Number(row.passengers),
          }));

          setReverse({
            daily: {
              passengers: data.map(row => row.passengers),
              x: data.map(row => row.date),
            },
            monthly: {
              passengers: data.map(row => row.passengers),
              x: data.map(row => row.date),
            },
            daily_7d: {
              passengers: data.map(row => row.passengers),
              x: data.map(row => row.date),
            },
            yearly: {
              passengers: data.map(row => row.passengers),
              x: data.map(row => row.date),
            },
          });

          if (reverseTotalResult && reverseTotalResult.numRows > 0) {
            const total = reverseTotalResult.toArray()[0].total[0];
            setReverseCallout({
              daily: data[data.length - 1].passengers,
              monthly: total,
            });
          }
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    executeQuery();
  }, [db, params]);

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-screen w-full items-center justify-center">
          <Spinner loading={true} />
        </div>
      </Container>
    );
  }

  if (error) {
    return <div>error</div>;
  }

  if (!forward || !reverse) {
    return null;
  }

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RapidExplorerDashboard
        A_to_B={forward}
        A_to_B_callout={forwardCallout}
        B_to_A={reverse}
        B_to_A_callout={reverseCallout}
        dropdown={dropdown}
        last_updated={last_updated}
        next_update={next_update}
        params={params}
      />
    </AnalyticsProvider>
  );
};

RapidExplorer.layout = (page, props) => {
  return (
    <Layout
      className={clx(body.variable, "font-sans")}
      banner={{
        namespace: "dashboard-rapid-explorer",
        key: "caveats",
        className:
          "border-y border-[#E4E4E7] bg-[#FAFAFA] text-[#3F3F46] [&>div>div>div>p>a]:text-[#3F3F46]",
      }}
    >
      {page}
    </Layout>
  );
};

/**
 * Path: /{service}/{origin}/{destination}
 * service - required - rail
 * origin - required - KJ10
 * destination - required - KJ15
 */
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-rapid-explorer",
  async ({ params }) => {
    const [service, origin, destination] = params?.service
      ? (params.service as string[])
      : ["rail", "KJ10: KLCC", "KJ15: KL Sentral"];

    const results = await Promise.allSettled([
      get("/explorer", { explorer: "Prasarana", dropdown: true }),
      get("/explorer", {
        explorer: "Prasarana",
        service,
        origin,
        destination,
      }),
      get("/explorer", {
        explorer: "Prasarana",
        service,
        origin: destination,
        destination: origin,
      }),
    ]);

    const [dropdown, A_to_B, B_to_A] = results.map(e => {
      if (e.status === "rejected") return {};
      else return e.value.data;
    });

    return {
      props: {
        meta: {
          id: "dashboard-rapid-explorer",
          type: "dashboard",
          category: "transportation",
          agency: "prasarana",
        },
        A_to_B: A_to_B.timeseries,
        A_to_B_callout: A_to_B.timeseries_callout.data,
        B_to_A: Object.keys(B_to_A.timeseries.data).length !== 0 ? B_to_A.timeseries.data : null,
        B_to_A_callout:
          Object.keys(B_to_A.timeseries_callout.data).length !== 0
            ? B_to_A.timeseries_callout.data
            : null,
        dropdown: dropdown,
        last_updated: A_to_B.data_last_updated,
        next_update: A_to_B.data_next_update ?? null,
        params: { service, origin, destination },
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RapidExplorer;
