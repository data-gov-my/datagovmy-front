import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { get } from "datagovmy-ui/api";
import { CountryAndStates, STATES } from "datagovmy-ui/constants";
import { clx, sortMsiaFirst } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { withi18n } from "datagovmy-ui/decorators";
import { body } from "datagovmy-ui/configs/font";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";

const COVID19State: Page = ({
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
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("dashboard-covid-19.header"))}
        description={t("dashboard-covid-19.description")}
        keywords={""}
      />
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

COVID19State.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.COVID_19}
          currentState={props?.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.COVID_19} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-covid-19", async ({ params }) => {
  const { data } = await get("/dashboard", { dashboard: "covid_epid", state: params?.state });
  data.snapshot_table.data = sortMsiaFirst(data.snapshot_table.data, "state");

  return {
    props: {
      meta: {
        id: "dashboard-covid-19",
        type: "dashboard",
        category: "healthcare",
        agency: "KKM",
      },
      params: params,
      last_updated: data.data_last_updated,
      snapshot_bar: data.snapshot_bar,
      snapshot_graphic: data.snapshot_graphic,
      timeseries: data.timeseries,
      statistics: data.statistics,
    },
  };
});

export default COVID19State;
