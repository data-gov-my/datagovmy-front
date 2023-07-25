import Metadata from "@components/Metadata";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import BloodDonationDashboard from "@dashboards/blood-donation";
import { DateTime } from "luxon";
import { Page } from "@lib/types";
import Layout from "@components/Layout";
import StateDropdown from "@components/Dropdown/StateDropdown";
import StateModal from "@components/Modal/StateModal";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";

const BloodDonation: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  barchart_age,
  barchart_time,
  barchart_variables,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-blood-donation", "common"]);

  let vars: Record<string, any> = {};

  // TODO (@irfan): optimise this later.
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
      <Metadata title={t("header")} description={t("description")} keywords="" />
      <BloodDonationDashboard
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
        barchart_variables={{
          data_as_of: barchart_variables.data_as_of,
          data: vars,
        }}
        choropleth={choropleth}
      />
    </>
  );
};

BloodDonation.layout = (page, props) => (
  <Layout
    stateSelector={
      <StateDropdown
        width="w-max xl:w-64"
        url={routes.BLOOD_DONATION}
        currentState={props.params.state}
        exclude={["pjy", "pls", "lbn"]}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.BLOOD_DONATION} exclude={["pjy", "pls", "lbn"]} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-blood-donation", "common"],
  async () => {
    const { data } = await get("/dashboard", { dashboard: "blood_donation", state: "mys" });

    // transform:
    data.bar_chart_time.data.monthly.x = data.bar_chart_time.data.monthly.x.map((item: any) => {
      const period = DateTime.fromFormat(item, "yyyy-MM-dd");
      return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
    });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-blood-donation",
          type: "dashboard",
          category: "healthcare",
          agency: "PDN",
        },
        last_updated: data.data_last_updated,
        params: { state: "mys" },
        timeseries: data.timeseries_all,
        barchart_age: data.bar_chart_age,
        barchart_time: data.bar_chart_time,
        barchart_variables: data.barchart_key_variables,
        choropleth: data.choropleth_malaysia,
      },
    };
  }
);

export default BloodDonation;
