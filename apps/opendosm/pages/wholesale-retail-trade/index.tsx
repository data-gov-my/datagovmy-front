import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import WholesaleRetailDashboard from "@dashboards/wholesale-retail";
import { withi18n } from "datagovmy-ui/decorators";

const WholesaleRetail: Page = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.wholesale_retail")}
        description={t("wholesaleretail.description")}
        keywords={""}
      />
      <WholesaleRetailDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard", { dashboard: "wholesale_retail_trade" });

  return {
    notFound: true,
    props: {
      meta: {
        id: "dashboard-wholesale-retail-trade",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      // last_updated: new Date().valueOf(),
      // timeseries: data.timeseries,
      // timeseries_callouts: data.statistics,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default WholesaleRetail;
