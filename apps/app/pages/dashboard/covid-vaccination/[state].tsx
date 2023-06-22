/**
 * Covid Vaccination Page <State>
 */
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import CovidVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";
import { CountryAndStates, STATES } from "@lib/constants";
import { get } from "@lib/api";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { useTranslation } from "next-i18next";
import { routes } from "@lib/routes";
import Fonts from "@config/font";
import { clx } from "@lib/helpers";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const CovidVaccinationState: Page = ({
  meta,
  lastUpdated,
  params,
  waffle,
  barmeter,
  timeseries,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("page_title"))}
        description={t("description")}
        keywords=""
      />
      <CovidVaccinationDashboard
        lastUpdated={lastUpdated}
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
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown
        url={routes.COVID_VACCINATION}
        currentState={props?.params.state}
        hideOnScroll
      />
    }
  >
    <StateModal state={props.params.state} url={routes.COVID_VACCINATION} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  //   let paths: Array<any> = [];
  //   STATES.filter(state => {
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
        lastUpdated: new Date().valueOf(),
        waffle: data.waffle,
        barmeter: data.bar_chart,
        timeseries: data.timeseries,
        statistics: data.statistics,
      },
    };
  }
);

export default CovidVaccinationState;
