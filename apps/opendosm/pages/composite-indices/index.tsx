import type { InferGetStaticPropsType } from "next";
import { GetStaticProps } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import CompositeIndexDashboard from "@dashboards/composite-indices";

const CompositeIndices: Page = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.composite_index")}
        description={t("compositeindex.description")}
        keywords={""}
      />
      {/* <CompositeIndexDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      /> */}
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard", { dashboard: "composite_indices" });

  return {
    notFound: true,
    props: {
      //   last_updated: new Date().valueOf(),
      //   timeseries: data.timeseries,
      //   timeseries_callouts: data.statistics,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default CompositeIndices;
