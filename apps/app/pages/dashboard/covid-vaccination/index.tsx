import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import COVIDVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";
import { withi18n } from "@lib/decorators";

const CovidVaccination: Page = ({
  timeseries,
  statistics,
  barmeter,
  waffle,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-covid-vaccination"]);

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
export const getStaticProps: GetStaticProps = withi18n("dashboard-covid-vaccination", async () => {
  const { data } = await get("/dashboard", { dashboard: "covid_vax", state: "mys" });

  return {
    notFound: false,
    props: {
      timeseries: data.timeseries,
      statistics: data.statistics,
      barmeter: data.bar_chart,
      waffle: data.waffle,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default CovidVaccination;
