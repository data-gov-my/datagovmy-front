import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import COVIDVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Layout from "@components/Layout";

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
      <Metadata title={t("page_title")} description={t("description")} keywords={""} />
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
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.COVID_VACCINATION}
          currentState={props?.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.COVID_VACCINATION} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-covid-vaccination", async () => {
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
});

export default CovidVaccination;
