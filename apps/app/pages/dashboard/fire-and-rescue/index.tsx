import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import FireandRescueDashboard from "@dashboards/public-safety/fire-and-rescue";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const FireandRescue: Page = ({
  meta,
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-fire-and-rescue", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <FireandRescueDashboard
        choropleth={choropleth}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};
FireandRescue.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown url={routes.FIRE_RESCUE} currentState={props.params.state} hideOnScroll />
    }
  >
    <StateModal state={props.params.state} url={routes.FIRE_RESCUE} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-fire-and-rescue", async () => {
  const { data } = await get("/dashboard", { dashboard: "bomba", state: "mys" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-fire-and-rescue",
        type: "dashboard",
        category: "public-safety",
        agency: "BOMBA",
      },
      last_updated: data.data_last_updated,
      params: { state: "mys" },
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
      choropleth: data.choropleth,
    },
  };
});

export default FireandRescue;
