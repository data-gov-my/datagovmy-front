import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { get } from "@lib/api";
import { CountryAndStates, STATES } from "@lib/constants";
import { sortMsiaFirst } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Fonts from "@config/font";

const COVID19State: Page = ({
  last_updated,
  snapshot_bar,
  snapshot_graphic,
  timeseries_admitted,
  timeseries_cases,
  timeseries_deaths,
  timeseries_icu,
  timeseries_tests,
  timeseries_vents,
  util_chart,
  statistics,
  state,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-covid-19"]);
  return (
    <>
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("dashboard-covid-19.header"))}
        description={t("dashboard-covid-19.description")}
        keywords={""}
      />
      <COVID19Dashboard
        last_updated={last_updated}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        timeseries_admitted={timeseries_admitted}
        timeseries_cases={timeseries_cases}
        timeseries_deaths={timeseries_deaths}
        timeseries_icu={timeseries_icu}
        timeseries_tests={timeseries_tests}
        timeseries_vents={timeseries_vents}
        util_chart={util_chart}
        statistics={statistics}
      />
    </>
  );
};

COVID19State.layout = page => (
  <Layout
    className={[Fonts.body.variable, "font-sans"].join(" ")}
    stateSelector={
      <StateDropdown
        url={routes.COVID_19}
        currentState={(useRouter().query.state as string) ?? "mys"}
        exclude={["kvy"]}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.COVID_19} exclude={["kvy"]} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  let paths: Array<any> = [];
  STATES.filter(item => !["kvy"].includes(item.key)).forEach(state => {
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

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-covid-19"], null, [
    "en-GB",
    "ms-MY",
  ]);

  const { data } = await get("/dashboard", { dashboard: "covid_epid", state: params?.state });
  data.snapshot_table.data = sortMsiaFirst(data.snapshot_table.data, "state");

  return {
    props: {
      last_updated: new Date().valueOf(),
      snapshot_bar: data.snapshot_bar,
      snapshot_graphic: data.snapshot_graphic,
      timeseries_admitted: data.timeseries_admitted,
      timeseries_cases: data.timeseries_cases,
      timeseries_deaths: data.timeseries_deaths,
      timeseries_icu: data.timeseries_icu,
      timeseries_tests: data.timeseries_tests,
      timeseries_vents: data.timeseries_vents,
      util_chart: data.util_chart,
      statistics: data.statistics,
      state: params?.state,
      ...i18n,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default COVID19State;
