import KawasankuDashboard from "@dashboards/kawasanku";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { STATES } from "datagovmy-ui/schema/kawasanku";
import { Page } from "datagovmy-ui/types";
import { GeoJsonObject } from "geojson";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useEffect, useState } from "react";

const KawasankuParlimen: Page = ({
  bar,
  jitterplot,
  pyramid,
  choropleth,
  population_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-kawasanku"]);
  const [geo, setGeo] = useState<undefined | GeoJsonObject>(undefined);

  // useWatch(
  //   () => {
  //     import(`datagovmy-ui/geojson/parlimen/${ctx.id}`).then(item => {
  //       setGeo(item.default as unknown as GeoJsonObject);
  //     });
  //   },
  //   [ctx.id],
  //   true
  // );

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <KawasankuDashboard
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        choropleth={choropleth}
        population_callout={population_callout}
        jitterplot_options={STATES.filter(item => item.value !== "malaysia")}
        geojson={geo}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-kawasanku", async () => {
  // const { data } = await get("/dashboard/", {
  //   "dashboard": "kawasanku_admin",
  //   "area": "malaysia",
  //   "area-type": "country",
  // });

  return {
    props: {
      meta: {
        id: "dashboard-kawasanku",
        type: "dashboard",
        category: "demography",
        agency: "DOSM",
      },
      // bar: data.bar_chart,
      // population_callout: {
      //   total: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "total")?.y,
      //   male: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "male")?.y,
      //   female: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "female")
      //     ?.y,
      // },
      // jitterplot: data.jitter_chart,
      // pyramid: data.pyramid_chart,
      // choropleth: {
      //   data_as_of: data.choropleth_parlimen.data_as_of,
      //   data: {
      //     dun: data.choropleth_dun.data,
      //     parlimen: data.choropleth_parlimen.data,
      //   },
      // },
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default KawasankuParlimen;
