import RapidBusRailExplorerDashboard from "@dashboards/transportation/rapid-bus-and-rail-explorer";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const RapidBusRailExplorer: Page = ({
  meta,
  A_to_B,
  A_to_B_callout,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-rapid-bus-and-rail-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RapidBusRailExplorerDashboard
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
 * service - required - tebrau
 * origin - required - JB SENTRAL
 * destination - required - WOODLANDS CIQ
 */
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-rapid-bus-and-rail-explorer", "dashboard-public-transportation"],
  async ({ params }) => {
    try {
      // const [service, origin, destination] = params?.service
      //   ? (params.service as string[])
      //   : ["tebrau", "JB SENTRAL", "WOODLANDS CIQ"];

      // const results = await Promise.allSettled([
      //   get("/explorer", { explorer: "Prasarana", dropdown: true }),
      //   get("/explorer", {
      //     explorer: "Prasarana",
      //     service,
      //     origin,
      //     destination,
      //   }),
      //   get("/explorer", {
      //     explorer: "Prasarana",
      //     service,
      //     origin: destination,
      //     destination: origin,
      //   }),
      // ]);

      // const [dropdown, A_to_B, B_to_A] = results.map(e => {
      //   if (e.status === "rejected") return {};
      //   else return e.value.data;
      // });

      return {
        notFound: false,
        props: {
          meta: {
            id: "dashboard-rapid-bus-and-rail-explorer",
            type: "dashboard",
            category: "transportation",
            agency: "MoT",
          },
          // A_to_B: A_to_B.timeseries,
          // A_to_B_callout: A_to_B.timeseries_callout.data,
          // B_to_A: Object.keys(B_to_A).length !== 0 ? B_to_A.timeseries.data : null,
          // B_to_A_callout: Object.keys(B_to_A).length !== 0 ? B_to_A.timeseries_callout.data : null,
          // dropdown: dropdown,
          // last_updated: A_to_B.data_last_updated,
          // params: params?.service ? { service, origin, destination } : {},
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default RapidBusRailExplorer;
