import { Metadata } from "datagovmy-ui/components";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";

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

    const [{ data: dropdown }, { data: A_to_B }, { data: B_to_A }] = await Promise.all([
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
        A_to_B: A_to_B.timeseries,
        A_to_B_callout: A_to_B.timeseries_callout.data,
        B_to_A: B_to_A.timeseries.data,
        B_to_A_callout: B_to_A.timeseries_callout.data,
        dropdown: dropdown,
        last_updated: A_to_B.data_last_updated,
        params: {},
      },
    };
  } catch (e: any) {
    console.error(e.message);
    return { notFound: true };
  }
});

export default KTMBExplorer;
