import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import FireandRescueDashboard from "@dashboards/public-safety/fire-and-rescue";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@hooks/useWindow";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import type { InferGetStaticPropsType } from "next";
import { GetStaticPaths, GetStaticProps } from "next";

const FireandRescueState: Page = ({
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
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
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

FireandRescueState.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(Fonts.body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.FIRE_RESCUE}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.FIRE_RESCUE} />
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
  "dashboard-fire-and-rescue",
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "bomba", state: params?.state });

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
        params: params,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
        choropleth: data.choropleth,
      },
    };
  }
);

export default FireandRescueState;
