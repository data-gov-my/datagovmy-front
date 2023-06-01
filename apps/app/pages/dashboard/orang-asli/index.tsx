import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { Metadata } from "@components/index";
import OrangAsliDashboard from "@dashboards/demography/orang-asli";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";

const OrangAsli: Page = ({
  barmeter,
  choropleth,
  last_updated,
  pyramid,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-orang-asli", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <OrangAsliDashboard
        barmeter={barmeter}
        choropleth={choropleth}
        last_updated={last_updated}
        pyramid={pyramid}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-orang-asli", async () => {
  const { data } = await get("/dashboard", { dashboard: "unhcr" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-orang-asli",
        type: "dashboard",
        category: "demography",
        agency: "JAKOA",
      },
      barmeter: data.barmeter,
      choropleth: data.choropleth,
      last_updated: Date.now(),
      pyramid: [], //data.pyramid,
    },
  };
});

export default OrangAsli;
