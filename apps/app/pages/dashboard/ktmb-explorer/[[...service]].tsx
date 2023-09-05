import { Metadata } from "datagovmy-ui/components";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const KTMBExplorer: Page = ({
  meta,
  A_to_B,
  A_to_B_callout,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-ktmb-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <KTMBExplorerDashboard
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
  "dashboard-ktmb-explorer",
  async ({ params }) => {
    try {
      const [service, origin, destination] = params?.service
        ? (params.service as string[])
        : ["tebrau", "JB SENTRAL", "WOODLANDS CIQ"];

      const results = await Promise.allSettled([
        get("/explorer", { explorer: "KTMB", dropdown: true }),
        get("/explorer", {
          explorer: "KTMB",
          service,
          origin,
          destination,
        }),
        get("/explorer", {
          explorer: "KTMB",
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
        notFound: false,
        props: {
          meta: {
            id: "dashboard-ktmb-explorer",
            type: "dashboard",
            category: "transportation",
            agency: "MoT",
          },
          A_to_B: A_to_B.timeseries,
          A_to_B_callout: A_to_B.timeseries_callout.data,
          B_to_A: B_to_A ? B_to_A.timeseries.data : null,
          B_to_A_callout: B_to_A ? B_to_A.timeseries_callout.data : null,
          dropdown: dropdown,
          last_updated: A_to_B.data_last_updated,
          params: params?.service ? { service, origin, destination } : {},
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default KTMBExplorer;
