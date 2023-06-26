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
import { AnalyticsProvider } from "@hooks/useAnalytics";

const PekaB40: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peka-b40", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PekaB40Dashboard
        params={params}
        last_updated={last_updated}
        timeseries={timeseries}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

PekaB40.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown url={routes.PEKA_B40} currentState={props.params.state} hideOnScroll />
    }
  >
    <StateModal state={props.params.state} url={routes.PEKA_B40} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-peka-b40", async () => {
  const { data } = await get("/dashboard", { dashboard: "peka_b40", state: "mys" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-peka-b40",
        type: "dashboard",
        category: "healthcare",
        agency: "PHCorp",
      },
      last_updated: data.data_last_updated,
      params: { state: "mys" },
      timeseries: data.timeseries,
      choropleth: data.choropleth_malaysia,
    },
  };
});

export default PekaB40;
