import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import COVID19Dashboard from "@dashboards/covid-19";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

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

COVID19.layout = (page, props) => (
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown url={routes.COVID_19} currentState={"mys"} exclude={["kvy"]} hideOnScroll />
      }
    >
      <StateModal state={props.params.state} exclude={["kvy"]} url={routes.COVID_19} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-covid-19", "common"],
  async () => {
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
  }
);

export default COVID19;
