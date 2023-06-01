import Metadata from "@components/Metadata";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";

const KTMBExplorer: Page = ({
  dropdown,
  last_updated,
  A_to_B,
  A_to_B_callout,
  params,
  B_to_A,
  B_to_A_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-ktmb-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <KTMBExplorerDashboard
        dropdown={dropdown}
        last_updated={last_updated}
        A_to_B={A_to_B}
        A_to_B_callout={A_to_B_callout}
        params={params}
        B_to_A={B_to_A}
        B_to_A_callout={B_to_A_callout}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-ktmb-explorer", async () => {
  const origin = "JB SENTRAL";
  const destination = "WOODLANDS CIQ";
  const { data: dropdown } = await get("/dropdown", { dashboard: "ktmb" });
  const { data: A_to_B } = await get("/dashboard", {
    dashboard: "ktmb",
    service: "tebrau",
    origin,
    destination,
  });
  const { data: B_to_A } = await get("/dashboard", {
    dashboard: "ktmb",
    service: "tebrau",
    origin: destination,
    destination: origin,
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
      dropdown: dropdown.data,
      last_updated: Date.now(),
      A_to_B: A_to_B.timeseries.data,
      A_to_B_callout: A_to_B.timeseries_callout.data,
      params: { station_A: origin, station_B: destination },
      B_to_A: B_to_A.timeseries.data,
      B_to_A_callout: B_to_A.timeseries_callout.data,
    },
  };
});

export default KTMBExplorer;
