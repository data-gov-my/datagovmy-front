import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import PekaB40Dashboard from "@dashboards/healthcare/peka-b40";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";

const PekaB40: Page = ({
  last_updated,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peka-b40", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={<StateDropdown url={routes.PEKA_B40} currentState={"mys"} hideOnScroll />}
  >
    <StateModal url={routes.PEKA_B40} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-peka-b40", async () => {
  const { data } = await get("/dashboard", { dashboard: "peka_b40", state: "mys" });

  return {
    notFound: false,
    props: {
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      choropleth: data.choropleth_malaysia,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default PekaB40;
