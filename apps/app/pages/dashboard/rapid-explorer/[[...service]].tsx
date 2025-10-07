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
import { useDuckDb, DuckDBQuery } from "datagovmy-ui/hooks";
import { useEffect } from "react";

type RapidExplorerVariable = "forward" | "reverse" | "forwardCallout" | "reverseCallout";

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

  // Define query configurations for the rapid explorer dashboard
  const queryConfigs: DuckDBQuery<RapidExplorerVariable>[] = [
    {
      name: "forward",
      defaultValue: null,
      select: `origin,
          destination,
          date,
          passengers`,
      filters: `origin = '${params.origin}'
          AND destination = '${params.destination}'
        ORDER BY date ASC
      `,
    },
    {
      name: "reverse",
      defaultValue: null,
      select: `origin,
          destination,
          date,
          passengers`,
      filters: `origin = '${params.destination}'
          AND destination = '${params.origin}'
        ORDER BY date ASC
      `,
    },
    {
      name: "forwardCallout",
      defaultValue: { daily: 0, monthly: 0 },
      select: `SUM(passengers) as total`,
      filters: `origin = '${params.origin}'
   AND destination = '${params.destination}'
          AND date >= '2025-10-01'
          AND date <= '2025-10-05'
      `,
    },
    {
      name: "reverseCallout",
      defaultValue: { daily: 0, monthly: 0 },
      select: `SUM(passengers) as total`,
      filters: `
        origin = '${params.destination}'
          AND destination = '${params.origin}'
          AND date >= '2025-10-01'
          AND date <= '2025-10-05'
      `,
    },
  ];

  const { queryData, setQueryData, executeQueries, loading, error, db } = useDuckDb(
    queryConfigs,
    `SELECT {{select}}
        FROM 'https://data.kijang.net/cb39dq/duckdb_test.parquet'
        WHERE`
  );

  // Process query results and update hook data
  const processQueryResults = (queryResults: any[]) => {
    // Process forward direction data
    const forwardResult = queryResults.find(r => r.name === "forward");
    if (forwardResult?.success && forwardResult.data) {
      const rows = forwardResult.data.toArray() || [];
      const data = rows.map((row: any) => ({
        origin: row.origin,
        destination: row.destination,
        date: row.date,
        passengers: Number(row.passengers),
      }));

      const processedForward = {
        data_as_of: "2025-09-24 23:59",
        data: {
          daily: {
            passengers: data.map((row: any) => row.passengers),
            x: data.map((row: any) => row.date),
          },
          monthly: {
            passengers: data.map((row: any) => row.passengers),
            x: data.map((row: any) => row.date),
          },
        },
      };

      setQueryData("forward", processedForward);

      const forwardCalloutResult = queryResults.find(r => r.name === "forwardCallout");
      if (forwardCalloutResult?.success && forwardCalloutResult.data) {
        const totalData = forwardCalloutResult.data.toArray() || [];
        const total = totalData[0]?.total?.[0] || 0;

        const dailyValue = data[data.length - 1]?.passengers || 0;

        setQueryData("forwardCallout", {
          daily: dailyValue,
          monthly: total,
        });
      }
    }

    // Process reverse direction data
    const reverseResult = queryResults.find(r => r.name === "reverse");
    if (reverseResult?.success && reverseResult.data) {
      const rows = reverseResult.data.toArray() || [];
      const data = rows.map((row: any) => ({
        origin: row.origin,
        destination: row.destination,
        date: row.date,
        passengers: Number(row.passengers),
      }));

      const processedReverse = {
        daily: {
          passengers: data.map((row: any) => row.passengers),
          x: data.map((row: any) => row.date),
        },
        monthly: {
          passengers: data.map((row: any) => row.passengers),
          x: data.map((row: any) => row.date),
        },
        daily_7d: {
          passengers: data.map((row: any) => row.passengers),
          x: data.map((row: any) => row.date),
        },
        yearly: {
          passengers: data.map((row: any) => row.passengers),
          x: data.map((row: any) => row.date),
        },
      };

      setQueryData("reverse", processedReverse);

      const reverseCalloutResult = queryResults.find(r => r.name === "reverseCallout");
      if (reverseCalloutResult?.success && reverseCalloutResult.data) {
        const totalData = reverseCalloutResult.data.toArray() || [];
        const total = totalData[0]?.total?.[0] || 0;

        // Get reverse data for daily calculation
        const dailyValue = data[data.length - 1]?.passengers || 0;

        setQueryData("reverseCallout", {
          daily: dailyValue,
          monthly: total,
        });
      }
    }
  };

  // Execute queries when component mounts or params change
  useEffect(() => {
    const runQueries = async () => {
      try {
        const results = await executeQueries();
        if (results) {
          processQueryResults(results);
        }
      } catch (error) {}
    };

    if (params?.origin && params?.destination) {
      runQueries();
    }
  }, [params, db]);

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
    return (
      <Container>
        <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">
              Failed to load transportation data
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {typeof error === "string" ? error : error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Container>
    );
  }

  const { forward, reverse, forwardCallout, reverseCallout } = queryData;

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
