import Metadata from "@components/Metadata";
import GDPDashboard from "@dashboards/economy/gdp";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";

const GDP = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-gdp", "common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.gdp")}
        description={t("description")}
        keywords={""}
      />
      <GDPDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-gdp", async () => {
  const { data } = await get("/dashboard", { dashboard: "gross_domestic_product" });

  return {
    props: {
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default GDP;
