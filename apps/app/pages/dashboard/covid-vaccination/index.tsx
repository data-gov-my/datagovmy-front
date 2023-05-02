import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import COVIDVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";
import { withi18n } from "@lib/decorators";

const CovidVaccination: Page = ({
  params,
  timeseries,
  statistics,
  barmeter,
  waffle,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);

  return (
    <>
      <Metadata title={t("page_title")} description={t("description")} keywords={""} />
      <COVIDVaccinationDashboard
        params={params}
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
      params: {
        state: "mys",
      },
      timeseries: data.timeseries,
      statistics: data.statistics,
      barmeter: data.bar_chart,
      waffle: data.waffle,
    },
  };
});

export default CovidVaccination;
