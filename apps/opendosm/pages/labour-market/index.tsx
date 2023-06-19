import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";

import LabourMarketDashboard from "@dashboards/labour-market";
import { withi18n } from "datagovmy-ui/decorators";

const Labour: Page = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.labour_market")}
        description={t("organ.title_description")}
        keywords={""}
      />
      <LabourMarketDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
        choropleth={choropleth}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard", { dashboard: "labour" });

  return {
    notFound: true,
    props: {
      meta: {
        id: "dashboard-labour-market",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      // last_updated: new Date().valueOf(),
      // bar: data.bar_chart,
      // timeseries: data.timeseries,
      // timeseries_callouts: data.statistics,
      // choropleth: data.choropleth_malaysia,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default Labour;
