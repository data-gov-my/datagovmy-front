import type { GeoJsonObject } from "geojson";

import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KawasankuDashboard from "@dashboards/kawasanku";
import Metadata from "@components/Metadata";
import MalaysiaGeojson from "@lib/geojson/malaysia.json";

import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { STATES } from "@lib/schema/kawasanku";

const KawasankuIndex: Page = ({
  bar,
  jitterplot,
  pyramid,
  choropleth,
  population_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.kawasanku")}
        description={t("kawasanku.description")}
        keywords={""}
      />
      <KawasankuDashboard
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        choropleth={choropleth}
        population_callout={population_callout}
        jitterplot_options={STATES.filter(item => item.value !== "malaysia")}
        geojson={MalaysiaGeojson as GeoJsonObject}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard/", {
    "dashboard": "kawasanku_admin",
    "area": "malaysia",
    "area-type": "country",
  });

  return {
    props: {
      ...i18n,
      bar: data.bar_chart,
      population_callout: {
        total: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "total")?.y,
        male: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "male")?.y,
        female: data.bar_chart_callout.data.tooltip.find(({ x }: { x: string }) => x === "female")
          ?.y,
      },
      jitterplot: data.jitter_chart,
      pyramid: data.pyramid_chart,
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

export default KawasankuIndex;
