import KawasankuDashboard from "@dashboards/kawasanku";
import { PARLIMENS, STATE_MAP } from "@lib/schema/kawasanku";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import getGeojson from "datagovmy-ui/geojson/parlimen";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";

const KawasankuParlimen: Page = ({
  last_updated,
  meta,
  params,
  bar,
  jitterplot,
  pyramid,
  choropleth,
  population_callout,
  jitterplot_options,
  geojson,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-kawasanku"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("title_area", { area: params.id })}
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
        jitterplot_options={jitterplot_options}
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
    if (typeof params.id !== "string") throw new Error("Incorrect param type: id. Must be string");

    const [{ data }, geojson] = await Promise.all([
      get("/dashboard/", {
        dashboard: "kawasanku_electoral",
        area: params.id,
        area_type: "parlimen",
      }),
      getGeojson[params.id.toLowerCase().replaceAll(" ", "_")],
    ]);

    const options = Object.entries(PARLIMENS)
      .sort((a: [string, unknown], b: [string, unknown]) =>
        a[0] === params!.state ? -1 : a[0].localeCompare(b[0])
      )
      .flatMap(([key, parlimens]) =>
        parlimens.map(({ label, value }) => ({
          label: `${label}, ${STATE_MAP[key]}`,
          value: value,
        }))
      );

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
          geofilter: "parlimen",
          id: params.id,
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
        jitterplot_options: options,
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

export default KawasankuParlimen;
