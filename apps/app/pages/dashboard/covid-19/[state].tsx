import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import COVID19Dashboard from "@dashboards/healthcare/covid-19";
import { get } from "@lib/api";
import { CountryAndStates, STATES } from "@lib/constants";
import { clx, sortMsiaFirst } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { withi18n } from "@lib/decorators";
import Fonts from "@config/font";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { WindowProvider } from "@hooks/useWindow";

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
      className={clx(Fonts.body.variable, "font-sans")}
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
