import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { CountryAndStates, STATES } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { get } from "@lib/api";
import { DateTime } from "luxon";
import { routes } from "@lib/routes";
import BloodDonationDashboard from "@dashboards/healthcare/blood-donation";
import Fonts from "@config/font";
import { clx } from "@lib/helpers";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { WindowProvider } from "@hooks/useWindow";

const BloodDonationState: Page = ({
  meta,
  last_updated,
  params,
  timeseries_all,
  barchart_age,
  barchart_time,
  barchart_variables,
  choropleth_malaysia_blood_donation,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-blood-donation", "common"]);
  let vars: Record<string, any> = {};

  Object.entries(barchart_variables.data).forEach(([key, values]: [string, any]) => {
    vars[key] = Object.entries(values).reduce((previous, current: [string, any]) => {
      return {
        ...previous,
        [current[0]]: current[1].map((item: any) => ({
          ...item,
          x: t(item.x),
        })),
      };
    }, {});
  });

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords=""
      />
      <BloodDonationDashboard
        last_updated={last_updated}
        params={params}
        timeseries_all={timeseries_all}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
        barchart_variables={{
          data_as_of: barchart_variables.data_as_of,
          data: vars,
        }}
        choropleth_malaysia_blood_donation={choropleth_malaysia_blood_donation}
      />
    </AnalyticsProvider>
  );
};

BloodDonationState.layout = (page, props) => (
  <WindowProvider>
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
  </WindowProvider>
);

// Build at runtime
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-blood-donation",
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "blood_donation", state: params?.state });

    // transfrom:
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
        params: params,
        timeseries_all: data.timeseries_all,
        barchart_age: data.bar_chart_age,
        barchart_time: data.bar_chart_time,
        barchart_variables: data.barchart_key_variables,
        choropleth_malaysia_blood_donation: data.choropleth_malaysia,
      },
    };
  }
);

export default BloodDonationState;
