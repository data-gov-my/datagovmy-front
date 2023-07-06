import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import IPRDashboard from "@dashboards/government-programs/ipr";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@hooks/useWindow";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";

const IPRState: Page = ({
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
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
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

IPRState.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(Fonts.body.variable, "font-sans")}
      stateSelector={
        <StateDropdown url={routes.IPR} currentState={props.params.state} hideOnScroll />
      }
    >
      <StateModal state={props.params.state} url={routes.IPR} />
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

export const getStaticProps: GetStaticProps = withi18n("dashboard-ipr", async ({ params }) => {
  const { data } = await get("/dashboard", {
    dashboard: "ipr",
    state: params?.state,
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
      last_updated: data.data_last_updated,
      params: params,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout.data,
      choropleth: data.choropleth,
    },
  };
});

export default IPRState;
