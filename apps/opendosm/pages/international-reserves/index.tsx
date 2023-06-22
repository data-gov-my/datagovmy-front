import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import InternationalReservesDashboard from "@dashboards/international-reserves";
import { withi18n } from "datagovmy-ui/decorators";

const InternationalReserves: Page = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.international_reserves")}
        description={t("international_reserves.description")}
        keywords={""}
      />
      <InternationalReservesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  const { data } = await get("/dashboard", { dashboard: "international_reserves" });

  return {
    props: {
      meta: {
        id: "dashboard-",
        type: "dashboard",
        category: "financial-sector",
        agency: "BNM",
      },
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default InternationalReserves;
