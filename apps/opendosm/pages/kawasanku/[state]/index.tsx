import type { GeoJsonObject } from "geojson";

import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Page } from "@lib/types";

import KawasankuDashboard from "@dashboards/kawasanku";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation, useWatch } from "datagovmy-ui/hooks";
import { STATES } from "@lib/schema/kawasanku";
import { get } from "@lib/api";
import { useState } from "react";
import { withi18n } from "datagovmy-ui/decorators";

const KawasankuState: Page = ({
  ctx,
  bar,
  jitterplot,
  pyramid,
  choropleth,
  population_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const [geo, setGeo] = useState<undefined | GeoJsonObject>(undefined);

  // useWatch(
  //   () => {
  //     import(`datagovmy-ui/geojson/state/${ctx.id}`).then(item => {
  //       setGeo(item.default as unknown as GeoJsonObject);
  //     });
  //   },
  //   [ctx.state],
  //   true
  // );

  return (
    <>
      <Metadata
        title={`${t("nav.megamenu.dashboards.kawasanku")} • 
        ${STATES.find(state => ctx.state === state.value)?.label}`}
        description={t("kawasanku.description")}
        keywords={""}
      />
      <KawasankuDashboard
        bar={bar}
        pyramid={pyramid}
        jitterplot={jitterplot}
        jitterplot_options={STATES.filter(item => item.value !== "malaysia")}
        choropleth={choropleth}
        population_callout={population_callout}
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

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard/", {
  //   "dashboard": "kawasanku_admin",
  //   "area": params!.state,
  //   "area-type": "state",
  // });

  return {
    notFound: true,
    props: {
      meta: {
        id: "dashboard-kawasanku",
        type: "dashboard",
        category: "demography",
        agency: "DOSM",
      },
      // ctx: params,
      // bar: data.bar_chart,
      // jitterplot: data.jitter_chart,
      // pyramid: data.pyramid_chart,
      // population_callout: {
      //   total: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "total")?.y,
      //   male: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "male")?.y,
      //   female: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "female")
      //     ?.y,
      // },
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

export default KawasankuState;
