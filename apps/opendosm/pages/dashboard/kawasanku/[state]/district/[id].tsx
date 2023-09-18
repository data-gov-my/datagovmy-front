import KawasankuDashboard from "@dashboards/kawasanku";
import { DISTRICTS, STATE_MAP } from "@lib/schema/kawasanku";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import getGeojson from "datagovmy-ui/geojson/district";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";

const KawasankuDistrict: Page = ({
  last_updated,
  meta,
  params,
  geojson,
  bar,
  jitterplot,
  jitterplot_options,
  population_callout,
  pyramid,
  choropleth,
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
        jitterplot_options={jitterplot_options}
        population_callout={population_callout}
        geojson={geojson}
        choropleth={choropleth}
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
    if (typeof params.id !== "string")
      throw new Error("Incorrect param type: district. Must be string");

    const [{ data }, geojson] = await Promise.all([
      get("/dashboard", { dashboard: "kawasanku_admin", area: params.id, area_type: "district" }),
      getGeojson[params.id.toLowerCase().replaceAll(" ", "_")],
    ]);

    const options = Object.entries(DISTRICTS)
      .sort((a: [string, unknown], b: [string, unknown]) =>
        a[0] === params!.state ? -1 : a[0].localeCompare(b[0])
      )
      .flatMap(([key, districts]) =>
        districts.map(({ label, value }) => ({
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
          geofilter: "district",
          id: params.id,
        },
        geojson,
        bar: data.bar_chart,
        jitterplot: data.jitter_chart,
        pyramid: data.pyramid_data,
        jitterplot_options: options,
        population_callout: {
          total: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "total")
            ?.y,
          male: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "male")?.y,
          female: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "female")
            ?.y,
        },
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

export default KawasankuDistrict;
