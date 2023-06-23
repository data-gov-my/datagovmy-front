import type { GeoJsonObject } from "geojson";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KawasankuDashboard from "@dashboards/kawasanku";
import Metadata from "@components/Metadata";

import { useTranslation } from "@hooks/useTranslation";
import { STATE_MAP, PARLIMENS } from "@lib/schema/kawasanku";
import { get } from "@lib/api";
import { useState } from "react";
import { useWatch } from "@hooks/useWatch";

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
      import(`@lib/geojson/kawasanku/parlimen/${ctx.id}`).then(item => {
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
        ${PARLIMENS[ctx.state].find(parlimen => parlimen.value === ctx.id)?.label}`}
        description={t("kawasanku.description")}
        keywords={""}
      />
      <KawasankuDashboard
        area_type="parlimen"
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        jitterplot_options={jitterplot_options}
        geojson={geo}
        population_callout={population_callout}
        choropleth={choropleth}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  /* First visit: SSR, consequent visits: ISR */

  //   let paths: Array<any> = [];

  //   STATES.filter(state => state.value !== "malaysia").forEach(state => {
  //     PARLIMENS[state.value].forEach(({ value }) => {
  //       paths = paths.concat([
  //         {
  //           params: {
  //             state: state.value,
  //             id: value,
  //           },
  //         },
  //         {
  //           params: {
  //             state: state.value,
  //             id: value,
  //           },
  //           locale: "ms-MY",
  //         },
  //       ]);
  //     });
  //   });

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard/", {
    "dashboard": "kawasanku_electoral",
    "area": params!.id,
    "area-type": "parlimen",
  });

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
      ...i18n,
      ctx: params,
      bar: data.bar_chart,
      jitterplot: data.jitter_chart,
      pyramid: data.pyramid_chart,
      jitterplot_options: options,
      population_callout: {
        total: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "total")?.y,
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
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default KawasankuArea;
