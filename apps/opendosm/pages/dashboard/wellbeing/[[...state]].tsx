import Layout from "@components/Layout";
import WellbeingDashboard from "@dashboards/wellbeing";
import { routes } from "@lib/routes";
import { get } from "datagovmy-ui/api";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { CountryAndStates } from "datagovmy-ui/constants";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const Wellbeing: Page = ({
  last_updated,
  next_update,
  meta,
  choropleth,
  heatmap,
  state,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboards");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={`${state ? CountryAndStates[state].concat(" - ") : ""}${t(
          "dashboards.wellbeing.name"
        )}`}
        description={t("dashboards.wellbeing.description")}
      />
      <WellbeingDashboard
        last_updated={last_updated}
        next_update={next_update}
        choropleth={choropleth}
        heatmap={heatmap}
        state={state}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

Wellbeing.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.WELLBEING}
          currentState={props.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.state} url={routes.WELLBEING} />
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

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-wellbeing",
  async ({ params }) => {
    const state = params?.state ? params.state[0] : "mys";
    const { data } = await get("/dashboard", { dashboard: "wellbeing_state", state });

    return {
      notFound: false,
      props: {
        last_updated: data.data_last_updated,
        next_update: data.data_next_update,
        meta: {
          id: "dashboard-wellbeing",
          type: "dashboard",
          category: "demography",
          agency: "DOSM",
        },
        choropleth: data.choropleth_state,
        heatmap: data.heatmap,
        state,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default Wellbeing;
