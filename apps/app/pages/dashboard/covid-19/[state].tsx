import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { get } from "@lib/api";
import { CountryAndStates, STATES } from "@lib/constants";
import { clx, sortMsiaFirst } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { withi18n } from "@lib/decorators";
import Fonts from "@config/font";

const COVID19State: Page = ({
  params,
  last_updated,
  snapshot_bar,
  snapshot_graphic,
  timeseries,
  util_chart,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-19", "common"]);
  return (
    <>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("dashboard-covid-19.header"))}
        description={t("dashboard-covid-19.description")}
        keywords={""}
      />
      <COVID19Dashboard
        params={params}
        last_updated={last_updated}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        timeseries={timeseries}
        util_chart={util_chart}
        statistics={statistics}
      />
    </>
  );
};

COVID19State.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={<StateDropdown url={routes.COVID_19} currentState={props?.state} hideOnScroll />}
  >
    <StateModal state={props.state} url={routes.COVID_19} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  let paths: Array<any> = [];
  STATES.forEach(state => {
    paths = paths.concat([
      {
        params: {
          state: state.key,
        },
      },
      {
        params: {
          state: state.key,
        },
        locale: "ms-MY",
      },
    ]);
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-covid-19", async ({ params }) => {
  const { data } = await get("/dashboard", { dashboard: "covid_epid", state: params?.state });
  data.snapshot_table.data = sortMsiaFirst(data.snapshot_table.data, "state");

  return {
    props: {
      params: params,
      last_updated: new Date().valueOf(),
      snapshot_bar: data.snapshot_bar,
      snapshot_graphic: data.snapshot_graphic,
      timeseries: {
        data_as_of: data.timeseries_admitted.data_as_of,
        data: {
          x: data.timeseries_admitted.data.x,
          admitted: data.timeseries_admitted.data.admitted,
          admitted_line: data.timeseries_admitted.data.line,
          cases: data.timeseries_cases.data.cases,
          cases_line: data.timeseries_cases.data.line,
          deaths_inpatient: data.timeseries_deaths.data.deaths_inpatient,
          deaths_brought_in: data.timeseries_deaths.data.deaths_brought_in,
          deaths_tooltip: data.timeseries_deaths.data.tooltip,
          deaths_line: data.timeseries_deaths.data.line,
          icu: data.timeseries_icu.data.icu,
          icu_line: data.timeseries_icu.data.line,
          tests_pcr: data.timeseries_tests.data.tests_pcr,
          tests_rtk: data.timeseries_tests.data.tests_rtk,
          tests_tooltip: data.timeseries_tests.data.tooltip,
          vents: data.timeseries_vents.data.vent,
          vents_line: data.timeseries_vents.data.line,
        },
      },
      util_chart: data.util_chart,
      statistics: data.statistics,
    },
  };
});

export default COVID19State;
