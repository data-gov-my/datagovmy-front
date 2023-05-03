import Metadata from "@components/Metadata";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import BloodDonationDashboard from "@dashboards/healthcare/blood-donation";
import { DateTime } from "luxon";
import { Page } from "@lib/types";
import Layout from "@components/Layout";
import StateDropdown from "@components/Dropdown/StateDropdown";
import StateModal from "@components/Modal/StateModal";
import Fonts from "@config/font";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";

const BloodDonation: Page = ({
  last_updated,
  params,
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  barchart_variables,
  map_facility,
  choropleth_malaysia_blood_donation,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-blood-donation", "common"]);

  let vars: Record<string, any> = {};

  Object.entries(barchart_variables.data).forEach(([key, values]: [string, any]) => {
    vars[key] = Object.entries(values).reduce((previous, current: [string, any]) => {
      return Object.assign(previous, {
        [current[0]]: current[1].map((item: any) => ({
          ...item,
          x: t(item.x),
        })),
      });
    }, {});
  });

  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.blood_donation")}
        description=""
        keywords=""
      />
      <BloodDonationDashboard
        last_updated={last_updated}
        params={params}
        timeseries_all={timeseries_all}
        timeseries_bloodstock={timeseries_bloodstock}
        timeseries_facility={timeseries_facility}
        heatmap_bloodstock={heatmap_bloodstock}
        heatmap_donorrate={heatmap_donorrate}
        heatmap_retention={heatmap_retention}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
        barchart_variables={{
          data_as_of: barchart_variables.data_as_of,
          data: vars,
        }}
        map_facility={map_facility}
        choropleth_malaysia_blood_donation={choropleth_malaysia_blood_donation}
      />
    </>
  );
};

BloodDonation.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown
        url={routes.BLOOD_DONATION}
        currentState={props.params.state}
        exclude={["pjy", "pls", "lbn"]}
        hideOnScroll
      />
    }
  >
    <StateModal
      state={props.params.state}
      url={routes.BLOOD_DONATION}
      exclude={["pjy", "pls", "lbn"]}
    />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-blood-donation", async () => {
  const { data } = await get("/dashboard", { dashboard: "blood_donation", state: "mys" });

  // transform:
  Object.values(data.heatmap_retention.data).forEach((item: any) => {
    item.data = item.data.filter((_item: any) => _item.y !== null);
  });

  data.bar_chart_time.data.monthly.x = data.bar_chart_time.data.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

  return {
    notFound: false,
    props: {
      last_updated: new Date().valueOf(),
      params: { state: "mys" },
      timeseries_all: data.timeseries_all,
      timeseries_bloodstock: data.timeseries_bloodstock,
      timeseries_facility: data.timeseries_facility,
      heatmap_donorrate: data.heatmap_donorrate,
      heatmap_bloodstock: Object.values(data.heatmap_bloodstock),
      heatmap_retention: Object.values(data.heatmap_retention),
      barchart_age: data.bar_chart_age,
      barchart_time: data.bar_chart_time,
      barchart_variables: data.barchart_key_variables,
      map_facility: data.map_facility,
      choropleth_malaysia_blood_donation: data.choropleth_malaysia,
    },
  };
});

export default BloodDonation;
