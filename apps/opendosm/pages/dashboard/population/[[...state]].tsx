import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import PopulationDashboard from "@dashboards/population";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import Layout from "@components/Layout";
import { clx } from "datagovmy-ui/helpers";
import { body } from "datagovmy-ui/configs/font";
import { routes } from "@lib/routes";
import { CountryAndStates } from "datagovmy-ui/constants";

const PopulationPage: Page = ({
  last_updated,
  meta,
  population_timeseries,
  vitalstats_timeseries,
  population_timeseries_callout,
  vitalstats_timeseries_callout,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-population", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={
          params.state ? CountryAndStates[params.state].concat(" - ", t("header")) : t("header")
        }
        description={t("description")}
        keywords={""}
      />
      <PopulationDashboard
        last_updated={last_updated}
        population_timeseries={population_timeseries}
        population_timeseries_callout={population_timeseries_callout}
        vitalstats_timeseries={vitalstats_timeseries}
        vitalstats_timeseries_callout={vitalstats_timeseries_callout}
        params={params}
      />
    </AnalyticsProvider>
  );
};

PopulationPage.layout = (page, props) => {
  return (
    <WindowProvider>
      <Layout
        className={clx(body.variable, "font-sans")}
        stateSelector={
          <StateDropdown
            width="w-max xl:w-64"
            url={routes.POPULATION}
            currentState={props.params.state}
            hideOnScroll
          />
        }
      >
        <StateModal state={props.params.state} url={routes.POPULATION} />
        {page}
      </Layout>
    </WindowProvider>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-population",
  async ({ params }) => {
    const state = params?.state ? params.state[0] : "mys";
    const { data } = await get("/dashboard", { dashboard: "population", state: state });

    return {
      props: {
        meta: {
          id: "dashboard-population",
          type: "dashboard",
          category: "demography",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        params: { state: state },
        population_timeseries: data.population_timeseries,
        vitalstats_timeseries: data.vitalstats_timeseries,
        population_timeseries_callout: data.population_timeseries_callout,
        vitalstats_timeseries_callout: data.vitalstats_timeseries_callout,
      },
    };
  }
);

export default PopulationPage;
