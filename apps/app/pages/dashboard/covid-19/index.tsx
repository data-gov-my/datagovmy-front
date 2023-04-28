import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";

const COVID19: Page = ({
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
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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

COVID19.layout = page => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={<StateDropdown url={routes.COVID_19} currentState={"mys"} hideOnScroll />}
  >
    <StateModal url={routes.COVID_19} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-covid-19", async () => {
  const { data } = await get("/dashboard", { dashboard: "covid_epid", state: "mys" });

  return {
    notFound: false,
    props: {
      params: {
        state: "mys",
      },
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

export default COVID19;
