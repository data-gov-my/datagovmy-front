import { Metadata } from "datagovmy-ui/components";
import GDPDashboard from "@dashboards/gdp";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";

import { withi18n } from "datagovmy-ui/decorators";

const GDP = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.gdp")}
        description={t("gdp.description")}
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

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
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
