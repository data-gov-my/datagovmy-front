import Metadata from "@components/Metadata";
import IndustrialProductionDashboard from "@dashboards/industrial-production";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const IndustrialProduction = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.industrial_production")}
        description={t("industry.description")}
        keywords={""}
      />
      <IndustrialProductionDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard", { dashboard: "industrial_production" });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default IndustrialProduction;
