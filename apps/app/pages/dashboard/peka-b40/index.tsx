import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import PekaB40Dashboard from "@dashboards/healthcare/peka-b40";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";

const PekaB40: Page = ({
  last_updated,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peka-b40", "common"]);

  return (
    <>
      <Metadata
        title={t("dashboard-peka-b40:header")}
        description={t("dashboard-peka-b40:description")}
        keywords={""}
      />
      <PekaB40Dashboard
        last_updated={last_updated}
        timeseries={timeseries}
        choropleth={choropleth}
      />
    </>
  );
};

PekaB40.layout = page => (
  <Layout
    className={[Fonts.body.variable, "font-sans"].join(" ")}
    stateSelector={<StateDropdown url={routes.PEKA_B40} currentState={"mys"} hideOnScroll />}
  >
    <StateModal url={routes.PEKA_B40} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-peka-b40", "common"]);
  const { data } = await get("/dashboard", { dashboard: "peka_b40", state: "mys" });

  return {
    notFound: false,
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      choropleth: data.choropleth_malaysia,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default PekaB40;
