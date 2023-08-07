import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import OrganDonationDashboard from "@dashboards/organ-donation";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { CountryAndStates } from "datagovmy-ui/constants";
import { routes } from "@lib/routes";
import { withi18n } from "datagovmy-ui/decorators";
import { DateTime } from "luxon";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

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
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.ORGAN_DONATION}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal url={routes.ORGAN_DONATION} state={props.params.state} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-organ-donation"],
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
