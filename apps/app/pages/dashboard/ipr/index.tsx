import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import IPRDashboard from "@dashboards/government-programs/ipr";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const IPR: Page = ({
  meta,
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-ipr", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <IPRDashboard
        choropleth={choropleth}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

IPR.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown url={routes.IPR} currentState={props.params.state} hideOnScroll />
    }
  >
    <StateModal state={props.params.state} url={routes.IPR} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-ipr", async () => {
  const { data } = await get("/dashboard", {
    dashboard: "ipr",
    state: "mys",
  });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-ipr",
        type: "dashboard",
        category: "government-programs",
        agency: "EPU",
      },
      choropleth: data.choropleth,
      last_updated: new Date().valueOf(),
      params: { state: "mys" },
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout.data,
    },
  };
});

export default IPR;
