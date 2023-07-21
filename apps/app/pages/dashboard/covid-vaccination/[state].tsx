import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import CovidVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { WindowProvider } from "@hooks/useWindow";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";

/**
 * Covid Vaccination Page <State>
 */

const CovidVaccinationState: Page = ({
  meta,
  last_updated,
  params,
  waffle,
  barmeter,
  timeseries,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("page_title"))}
        description={t("description")}
        keywords=""
      />
      <CovidVaccinationDashboard
        last_updated={last_updated}
        params={params}
        waffle={waffle}
        barmeter={barmeter}
        timeseries={timeseries}
        statistics={statistics}
      />
    </AnalyticsProvider>
  );
};

CovidVaccinationState.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(Fonts.body.variable, "font-sans")}
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

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-covid-vaccination",
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "covid_vax", state: params?.state });

    return {
      props: {
        meta: {
          id: "dashboard-covid-vaccination",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
        params: params,
        last_updated: data.data_last_updated,
        waffle: data.waffle,
        barmeter: data.bar_chart,
        timeseries: data.timeseries,
        statistics: data.statistics,
      },
    };
  }
);

export default CovidVaccinationState;
