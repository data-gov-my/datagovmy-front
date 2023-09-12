import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import COVIDVaccinationDashboard from "@dashboards/covid-vaccination";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const CovidVaccination: Page = ({
  meta,
  params,
  last_updated,
  timeseries,
  statistics,
  barmeter,
  waffle,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <COVIDVaccinationDashboard
        params={params}
        last_updated={last_updated}
        timeseries={timeseries}
        statistics={statistics}
        barmeter={barmeter}
        waffle={waffle}
      />
    </AnalyticsProvider>
  );
};

CovidVaccination.layout = (page, props) => (
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.COVID_VACCINATION}
          currentState={props?.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal url={routes.COVID_VACCINATION} state={props.params.state} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-covid-vaccination", "common"],
  async () => {
    const { data } = await get("/dashboard", { dashboard: "covid_vax", state: "mys" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-covid-vaccination",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
        params: { state: "mys" },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        statistics: data.statistics,
        barmeter: data.bar_chart,
        waffle: data.waffle,
      },
    };
  }
);

export default CovidVaccination;
