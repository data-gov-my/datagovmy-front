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
  origin_timeseries,
  origin_timeseries_callout,
  params,
  destination_timeseries,
  destination_timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-ktmb-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <KTMBExplorerDashboard
        dropdown={dropdown}
        last_updated={last_updated}
        origin_timeseries={origin_timeseries}
        origin_timeseries_callout={origin_timeseries_callout}
        params={params}
        destination_timeseries={destination_timeseries}
        destination_timeseries_callout={destination_timeseries_callout}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-ktmb-explorer", async () => {
  const station_A = "JB SENTRAL";
  const station_B = "WOODLANDS CIQ";
  const { data: dropdown } = await get("/dropdown", { dashboard: "ktmb" });
  const { data: origin } = await get("/dashboard", {
    dashboard: "ktmb",
    service: "tebrau",
    origin: station_A,
    destination: station_B,
  });
  const { data: destination } = await get("/dashboard", {
    dashboard: "ktmb",
    service: "tebrau",
    origin: station_B,
    destination: station_A,
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
      origin_timeseries: origin.timeseries,
      origin_timeseries_callout: origin.timeseries_callout,
      params: { station_A: station_A, station_B: station_B },
      destination_timeseries: destination.timeseries,
      destination_timeseries_callout: destination.timeseries_callout,
    },
  };
});

export default KTMBExplorer;
