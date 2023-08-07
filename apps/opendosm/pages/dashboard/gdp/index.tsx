import GDPDashboard from "@dashboards/gdp";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { GetStaticProps, InferGetServerSidePropsType } from "next";

import { withi18n } from "datagovmy-ui/decorators";

const GDP = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-gdp", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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
      meta: {
        id: "dashboard-gdp",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default GDP;
