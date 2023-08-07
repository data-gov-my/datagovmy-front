import Layout from "@components/Layout";
import HospitalBedUtilisationDashboard from "@dashboards/hospital-bed-utilisation";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { get } from "datagovmy-ui/api";
import { routes } from "@lib/routes";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { DateTime } from "luxon";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const HospitalBedUtilisation: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-hospital-bed-utilisation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <HospitalBedUtilisationDashboard
      // last_updated={last_updated}
      // params={params}
      // timeseries={timeseries}
      // choropleth={choropleth}
      // barchart_age={barchart_age}
      // barchart_time={barchart_time}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-hospital-bed-utilisation", "common"],
  async () => {
    // const { data } = await get("/dashboard", { dashboard: "organ_donation", state: "mys" });

    // // transform:
    // data.barchart_time.data.monthly.x = data.barchart_time.data.monthly.x.map((item: any) => {
    //   const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    //   return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
    // });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-hospital-bed-utilisation",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
        // last_updated: data.data_last_updated,
        // params: { state: "mys" },
        // timeseries: data.timeseries,
        // choropleth: data.choropleth_malaysia,
        // barchart_age: data.barchart_age,
        // barchart_time: data.barchart_time,
      },
    };
  }
);

export default HospitalBedUtilisation;
