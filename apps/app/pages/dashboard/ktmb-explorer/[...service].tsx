import Metadata from "@components/Metadata";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
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
    const [service, origin, destination] = params
      ? (params.service as string[])
      : [undefined, undefined, undefined];

    const { data: dropdown } = await get("/dropdown", { dashboard: "ktmb" });
    const { data: A_to_B } = await get("/dashboard", {
      dashboard: "ktmb",
      service,
      origin,
      destination,
    });
    const B_to_A = await get("/dashboard", {
      dashboard: "ktmb",
      service,
      origin: destination,
      destination: origin,
    }).catch(e => console.error(e.message));

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-ktmb-explorer",
          type: "dashboard",
          category: "transportation",
          agency: "MoT",
        },
        A_to_B: A_to_B.timeseries.data,
        A_to_B_callout: A_to_B.timeseries_callout.data,
        B_to_A: B_to_A ? B_to_A.data.timeseries.data : null,
        B_to_A_callout: B_to_A ? B_to_A.data.timeseries_callout.data : null,
        dropdown: dropdown.data,
        last_updated: A_to_B.data_last_updated,
        params: { service: service, origin: origin, destination: destination },
      },
    };
  }
);

export default KTMBExplorer;
