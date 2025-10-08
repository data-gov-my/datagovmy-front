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
import { Arrow } from "duckdb-wasm-kit";
import { getTimeseriesData } from "@queries/rapid-explorer";

type RapidExplorerVariable = "forward" | "reverse";

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
      query: getTimeseriesData({ origin: params.origin, destination: params.destination }),
    },
    {
      name: "reverse",
      defaultValue: null,
      query: getTimeseriesData({ origin: params.destination, destination: params.origin }),
    },
  ];

  const { queryData, setQueryData, executeQueries, loading, db } = useDuckDb(queryConfigs);

  const processQueryResults = (queryResults: Record<RapidExplorerVariable, Arrow>) => {
    if (queryResults.forward && Array.isArray(queryResults.forward)) {
      const dailyRows = queryResults.forward[0].toArray() || [];
      const monthlyRows = queryResults.forward[1].toArray() || [];

      const processedForward = {
        data_as_of: A_to_B.data_as_of,
        data: {
          daily: {
            passengers: dailyRows.map((row: any) => row.passengers),
            x: dailyRows.map((row: any) => row.date),
          },
          monthly: {
            passengers: monthlyRows.map((row: any) => row.passengers),
            x: monthlyRows.map((row: any) => row.date),
          },
        },
      };

      setQueryData("forward", processedForward);

      const dailyValue = dailyRows[dailyRows.length - 1]?.passengers || 0;
      const monthlyValue = monthlyRows[monthlyRows.length - 1]?.passengers || 0;

      setQueryData("forwardCallout", {
        daily: dailyValue,
        monthly: monthlyValue,
      });
    }

    if (queryResults.reverse && Array.isArray(queryResults.reverse)) {
      const dailyRows = queryResults.reverse[0].toArray() || [];
      const monthlyRows = queryResults.reverse[1].toArray() || [];

      const processedReverse = {
        daily: {
          passengers: dailyRows.map((row: any) => row.passengers),
          x: dailyRows.map((row: any) => row.date),
        },
        monthly: {
          passengers: monthlyRows.map((row: any) => row.passengers),
          x: monthlyRows.map((row: any) => row.date),
        },
      };

      setQueryData("reverse", processedReverse);

      const dailyValue = dailyRows[dailyRows.length - 1]?.passengers || 0;
      const monthlyValue = monthlyRows[monthlyRows.length - 1]?.passengers || 0;

      setQueryData("reverseCallout", {
        daily: dailyValue,
        monthly: monthlyValue,
      });
    }
  };

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
    } else {
      // Use default data
      setQueryData("forward", A_to_B);
      setQueryData("forwardCallout", A_to_B_callout);
      setQueryData("reverse", B_to_A);
      setQueryData("reverseCallout", B_to_A_callout);
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
        params: params?.service ? { service, origin, destination } : {},
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RapidExplorer;
