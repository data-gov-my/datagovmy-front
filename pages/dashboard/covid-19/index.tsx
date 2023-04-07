import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { sortMsiaFirst } from "@lib/helpers";

const COVID19: Page = ({
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
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-covid-19"]);

  return (
    <>
      <Metadata
        title={t("dashboard-covid-19:header")}
        description={t("dashboard-covid-19:description")}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-covid-19"], null, [
    "en-GB",
    "ms-MY",
  ]);

  const { data } = await get("/dashboard", { dashboard: "covid_epid", state: "mys" });

  return {
    notFound: false,
    props: {
      ...i18n,
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
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default COVID19;
