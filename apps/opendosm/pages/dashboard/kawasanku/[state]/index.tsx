import KawasankuDashboard from "@dashboards/kawasanku";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import getGeojson from "datagovmy-ui/geojson/state";
import { useTranslation } from "datagovmy-ui/hooks";
import { STATES } from "datagovmy-ui/schema/kawasanku";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Page } from "datagovmy-ui/types";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const KawasankuState: Page = ({
  last_updated,
  meta,
  params,
  bar,
  jitterplot,
  pyramid,
  choropleth,
  population_callout,
  geojson,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-kawasanku"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("title_area", { area: params.state })}
        description={t("description")}
        keywords={""}
      />
      <KawasankuDashboard
        last_updated={last_updated}
        params={params}
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        choropleth={choropleth}
        population_callout={population_callout}
        jitterplot_options={STATES.filter(item => item.value !== "malaysia")}
        geojson={geojson}
      />
    </AnalyticsProvider>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-kawasanku",
  async ({ params }) => {
    if (typeof params.state !== "string")
      throw new Error("Incorrect param type: state. Must be string");

    const [{ data }, geojson] = await Promise.all([
      get("/dashboard/", { dashboard: "kawasanku_admin", area: params.state, area_type: "state" }),
      getGeojson[params.state.toLowerCase().replaceAll(" ", "_")],
    ]);

    return {
      props: {
        last_updated: data.data_last_updated,
        meta: {
          id: "dashboard-kawasanku",
          type: "dashboard",
          category: "demography",
          agency: "DOSM",
        },
        params: {
          state: params.state,
          geofilter: "state",
        },
        geojson,
        bar: data.bar_chart,
        population_callout: {
          total: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "total")
            ?.y,
          male: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "male")?.y,
          female: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "female")
            ?.y,
        },
        jitterplot: data.jitter_chart,
        pyramid: data.pyramid_data,
        choropleth: {
          data_as_of: data.choropleth_parlimen.data_as_of,
          data: {
            dun: data.choropleth_dun.data,
            parlimen: data.choropleth_parlimen.data,
          },
        },
      },
    };
  }
);

export default KawasankuState;
