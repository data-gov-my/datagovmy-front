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
import { useEffect, useMemo } from "react";
import { Arrow } from "duckdb-wasm-kit";
import { getTimeseriesData, getTimeseriesDataMonthly } from "@queries/rapid-explorer";

type RapidExplorerVariable =
  | "forward_daily"
  | "reverse_daily"
  | "forward_monthly"
  | "reverse_monthly";

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
      name: "forward_daily",
      defaultValue: null,
      query: getTimeseriesData({ origin: params.origin, destination: params.destination }),
    },
    {
      name: "forward_monthly",
      defaultValue: null,
      query: getTimeseriesDataMonthly({ origin: params.origin, destination: params.destination }),
    },
    {
      name: "reverse_daily",
      defaultValue: null,
      query: getTimeseriesData({ origin: params.destination, destination: params.origin }),
    },
    {
      name: "reverse_monthly",
      defaultValue: null,
      query: getTimeseriesDataMonthly({ origin: params.destination, destination: params.origin }),
    },
  ];

  const { queryData, executeQueries, loading, db } = useDuckDb(queryConfigs);

  const { forward_daily, forward_monthly, reverse_daily, reverse_monthly } = queryData as Record<
    string,
    Arrow
  >;

  const timeseriesData = useMemo(() => {
    if (!(params?.origin && params?.destination)) {
      // Use default data
      return {
        forward: A_to_B,
        forwardCallout: A_to_B_callout,
        reverse: B_to_A,
        reverseCallout: B_to_A_callout,
      };
    }

    if (forward_daily && forward_monthly && reverse_daily && reverse_monthly) {
      const forwardDaily = forward_daily.toArray() || [];
      const forwardMonthly = forward_monthly.toArray() || [];

      const processedForward = {
        data_as_of: A_to_B.data_as_of,
        data: {
          daily: {
            passengers: forwardDaily.map((row: any) => row.passengers),
            x: forwardDaily.map((row: any) => row.date),
          },
          monthly: {
            passengers: forwardMonthly.map((row: any) => row.passengers),
            x: forwardMonthly.map((row: any) => row.date),
          },
        },
      };

      const _forwardCallout = {
        daily: forwardDaily[forwardDaily.length - 1]?.passengers || 0,
        monthly: forwardMonthly[forwardMonthly.length - 1]?.passengers || 0,
      };

      const reverseDaily = reverse_daily.toArray() || [];
      const reverseMonthly = reverse_monthly.toArray() || [];

      const processedReverse = {
        daily: {
          passengers: reverseDaily.map((row: any) => row.passengers),
          x: reverseDaily.map((row: any) => row.date),
        },
        monthly: {
          passengers: reverseMonthly.map((row: any) => row.passengers),
          x: reverseMonthly.map((row: any) => row.date),
        },
      };

      const _reverseCallout = {
        daily: reverseDaily[reverseDaily.length - 1]?.passengers || 0,
        monthly: reverseMonthly[reverseMonthly.length - 1]?.passengers || 0,
      };

      return {
        forward: processedForward,
        forwardCallout: _forwardCallout,
        reverse: processedReverse,
        reverseCallout: _reverseCallout,
      };
    }
  }, [queryData]);

  useEffect(() => {
    const runQueries = async () => {
      try {
        await executeQueries();
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

  if (!timeseriesData) {
    return null;
  }

  const { forward, reverse, forwardCallout, reverseCallout } = timeseriesData;

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
