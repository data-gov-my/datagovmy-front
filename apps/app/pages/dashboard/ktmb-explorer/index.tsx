import Metadata from "@components/Metadata";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";

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

export const getStaticProps: GetStaticProps = withi18n("dashboard-ktmb-explorer", async () => {
  try {
    const [service, origin, destination] = ["tebrau", "JB SENTRAL", "WOODLANDS CIQ"];

    const [dropdown, A_to_B, B_to_A] = await Promise.all([
      get("/dropdown", { dashboard: "ktmb" }),
      get("/dashboard", {
        dashboard: "ktmb",
        service,
        origin,
        destination,
      }),
      get("/dashboard", {
        dashboard: "ktmb",
        service,
        origin: destination,
        destination: origin,
      }),
    ]).catch(e => {
      throw new Error("Invalid service. Message: " + e);
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
        A_to_B: A_to_B.data.timeseries.data,
        A_to_B_callout: A_to_B.data.timeseries_callout.data,
        B_to_A: B_to_A.data.timeseries.data,
        B_to_A_callout: B_to_A.data.timeseries_callout.data,
        dropdown: dropdown.data.data,
        last_updated: A_to_B.data.data_last_updated,
        params: {},
      },
    };
  } catch (e: any) {
    console.error(e.message);
    return { notFound: true };
  }
});

export default KTMBExplorer;
