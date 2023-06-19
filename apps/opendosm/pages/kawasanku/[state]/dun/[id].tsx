import type { GeoJsonObject } from "geojson";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Page } from "@lib/types";

import KawasankuDashboard from "@dashboards/kawasanku";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation, useWatch } from "datagovmy-ui/hooks";
import { STATE_MAP, DUNS } from "@lib/schema/kawasanku";
import { get } from "@lib/api";
import { useState } from "react";
import { withi18n } from "datagovmy-ui/decorators";

const KawasankuArea: Page = ({
  ctx,
  bar,
  jitterplot,
  jitterplot_options,
  pyramid,
  choropleth,
  population_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const [geo, setGeo] = useState<undefined | GeoJsonObject>(undefined);

  useWatch(
    () => {
      import(`@lib/geojson/kawasanku/dun/${ctx.id}`).then(item => {
        setGeo(item.default as unknown as GeoJsonObject);
      });
    },
    [ctx.id],
    true
  );

  return (
    <>
      <Metadata
        title={`${t("nav.megamenu.dashboards.kawasanku")} • 
        ${DUNS[ctx.state].find(dun => dun.value === ctx.id)?.label}`}
        description={t("kawasanku.description")}
        keywords={""}
      />
      <KawasankuDashboard
        area_type="dun"
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        jitterplot_options={jitterplot_options}
        population_callout={population_callout}
        geojson={geo}
        choropleth={choropleth}
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
  //   "dashboard": "kawasanku_electoral",
  //   "area": params!.id,
  //   "area-type": "dun",
  // });

  // const options = Object.entries(DUNS)
  //   .sort((a: [string, unknown], b: [string, unknown]) =>
  //     a[0] === params!.state ? -1 : a[0].localeCompare(b[0])
  //   )
  //   .flatMap(([key, duns]) =>
  //     duns.map(({ label, value }) => ({
  //       label: `${label}, ${STATE_MAP[key]}`,
  //       value: value,
  //     }))
  //   );

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
      // jitterplot_options: options,
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

export default KawasankuArea;
