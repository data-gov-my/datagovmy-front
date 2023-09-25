import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
// import PovertyDashboard from "@dashboards/economy/poverty";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import LifeExpectancy from "@dashboards/life-expectancy";

const Poverty: Page = ({
  choropleth,
  heatmap,
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-life-expectancy"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <LifeExpectancy
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        choropleth={choropleth}
        heatmap={heatmap}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-life-expectancy", async () => {
  const { data } = await get("/dashboard", { dashboard: "lifetables" });

  return {
    notFound: false,
    props: {
      last_updated: data.data_last_updated,
      meta: {
        id: "dashboard-life-expectancy",
        type: "dashboard",
        category: "demography",
        agency: "DOSM",
      },
      choropleth: { state: data.choropleth_state },
      heatmap: data.heatmap,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default Poverty;
