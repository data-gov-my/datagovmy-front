import RapidExplorerDashboard from "@dashboards/transportation/rapid-explorer";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const RapidExplorer: Page = ({
  meta,
  A_to_B,
  A_to_B_callout,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-rapid-explorer");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RapidExplorerDashboard
        A_to_B={A_to_B}
        A_to_B_callout={A_to_B_callout}
        B_to_A={B_to_A}
        B_to_A_callout={B_to_A_callout}
        dropdown={dropdown}
        last_updated={last_updated}
        params={params}
      />
    </AnalyticsProvider>
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
        params: params?.service ? { service, origin, destination } : {},
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RapidExplorer;
