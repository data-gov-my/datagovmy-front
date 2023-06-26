import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "@hooks/useTranslation";
import { routes } from "@lib/routes";
import Fonts from "@config/font";
import OrganDonationDashboard from "@dashboards/healthcare/organ-donation";
import { DateTime } from "luxon";
import { clx } from "@lib/helpers";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const OrganDonationState: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-organ-donation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
      <OrganDonationDashboard
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        choropleth={choropleth}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
      />
    </AnalyticsProvider>
  );
};

OrganDonationState.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown url={routes.ORGAN_DONATION} currentState={props.params.state} hideOnScroll />
    }
  >
    <StateModal state={props.params.state} url={routes.ORGAN_DONATION} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  //   let paths: Array<any> = [];
  //   STATES.forEach(state => {
  //     paths = paths.concat([
  //       {
  //         params: {
  //           state: state.key,
  //         },
  //       },
  //       {
  //         params: {
  //           state: state.key,
  //         },
  //         locale: "ms-MY",
  //       },
  //     ]);
  //   });
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-organ-donation",
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "organ_donation", state: params?.state });

    // transform:
    data.barchart_time.data.monthly.x = data.barchart_time.data.monthly.x.map((item: any) => {
      const period = DateTime.fromFormat(item, "yyyy-MM-dd");
      return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
    });

    return {
      props: {
        meta: {
          id: "dashboard-organ-donation",
          type: "dashboard",
          category: "healthcare",
          agency: "NTRC",
        },
        last_updated: data.data_last_updated,
        params: params,
        timeseries: data.timeseries,
        choropleth: data.choropleth_malaysia,
        barchart_age: data.barchart_age,
        barchart_time: data.barchart_time,
      },
    };
  }
);

export default OrganDonationState;
