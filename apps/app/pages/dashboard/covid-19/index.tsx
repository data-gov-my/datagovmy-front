import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@hooks/useWindow";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";

const COVID19: Page = ({
  meta,
  params,
  last_updated,
  snapshot_bar,
  snapshot_graphic,
  timeseries,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-19", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <COVID19Dashboard
        params={params}
        last_updated={last_updated}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        timeseries={timeseries}
        statistics={statistics}
      />
    </AnalyticsProvider>
  );
};

COVID19.layout = page => (
  <WindowProvider>
    <Layout
      className={clx(Fonts.body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.COVID_19}
          currentState={"mys"}
          hideOnScroll
        />
      }
    >
      <StateModal state="mys" url={routes.COVID_19} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-covid-19", async () => {
  const { data } = await get("/dashboard", { dashboard: "covid_epid", state: "mys" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-covid-19",
        type: "dashboard",
        category: "healthcare",
        agency: "KKM",
      },
      params: { state: "mys" },
      last_updated: data.data_last_updated,
      snapshot_bar: data.snapshot_bar,
      snapshot_graphic: data.snapshot_graphic,
      timeseries: data.timeseries,
      statistics: data.statistics,
    },
  };
});

export default COVID19;
