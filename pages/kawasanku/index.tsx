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
        jitterplot_options={STATES.filter(item => item.value !== "malaysia")}
        geojson={MalaysiaGeojson as GeoJsonObject}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return { notFound: true };
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard/", {
    "dashboard": "kawasanku_admin",
    "area": "malaysia",
    "area-type": "country",
  });

  return {
    // notFound: true,
    props: {
      ...i18n,
      bar: data.bar_chart,
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
