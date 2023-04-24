import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import COVIDVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";

const CovidVaccination: Page = ({
  timeseries,
  statistics,
  barmeter,
  waffle,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);

  return (
    <>
      <Metadata
        title={t("dashboard-covid-vaccination:page_title")}
        description={t("dashboard-covid-vaccination:description")}
        keywords={""}
      />
      <COVIDVaccinationDashboard
        lastUpdated={Date.now()}
        timeseries={timeseries}
        statistics={statistics}
        barmeter={barmeter}
        waffle={waffle}
      />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-covid-vaccination", "common"]);
  const { data } = await get("/dashboard", { dashboard: "covid_vax", state: "mys" });

  return {
    notFound: false,
    props: {
      ...i18n,
      timeseries: data.timeseries,
      statistics: data.statistics,
      barmeter: data.bar_chart,
      waffle: data.waffle,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default CovidVaccination;
