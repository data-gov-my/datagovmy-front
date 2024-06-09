import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import Layout from "@components/Layout";
import { clx } from "datagovmy-ui/helpers";
import { body } from "datagovmy-ui/configs/font";
import { routes } from "@lib/routes";
import { CountryAndStates } from "datagovmy-ui/constants";
import HousePricesDashboard from "@dashboards/economy/house-prices";

const HousePrices: Page = ({
  last_updated,
  next_update,
  meta,
  timeseries,
  timeseries_callout,
  choropleth,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-house-prices"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={
          params.state ? CountryAndStates[params.state].concat(" - ", t("header")) : t("header")
        }
        description={t("description")}
        keywords={""}
      />
      <HousePricesDashboard
        last_updated={last_updated}
        next_update={next_update}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        params={params}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

HousePrices.layout = (page, props) => {
  return (
    <WindowProvider>
      <Layout
        className={clx(body.variable, "font-sans")}
        stateSelector={
          <StateDropdown
            width="w-max xl:w-64"
            url={routes.HOUSE_PRICES}
            currentState={props.params.state}
            hideOnScroll
          />
        }
      >
        <StateModal state={props.params.state} url={routes.HOUSE_PRICES} />
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
  "dashboard-house-prices",
  async ({ params }) => {
    const state = params?.state ? params.state[0] : "mys";
    const { data } = await get("/dashboard", { dashboard: "house_prices", state: state });

    const yAxisInNumber = {
      all: data.houseprice_choropleth_state.data.y.all.map((num: string) => Number(num) || 0),
      terrace: data.houseprice_choropleth_state.data.y.terrace.map(
        (num: string) => Number(num) || 0
      ),
      high_rise: data.houseprice_choropleth_state.data.y.high_rise.map(
        (num: string) => Number(num) || 0
      ),
      detached: data.houseprice_choropleth_state.data.y.detached.map(
        (num: string) => Number(num) || 0
      ),
      semi_detached: data.houseprice_choropleth_state.data.y.semi_detached.map(
        (num: string) => Number(num) || 0
      ),
    };

    return {
      props: {
        meta: {
          id: "dashboard-house-prices",
          type: "dashboard",
          category: "economy",
          agency: "NAPIC",
        },
        last_updated: data.data_last_updated,
        next_update: data.data_next_update,
        params: { state: state },
        timeseries: data.houseprice_timeseries,
        timeseries_callout: data.houseprice_timeseries_callout,
        choropleth: {
          data_as_of: data.houseprice_choropleth_state.data_as_of,
          data: {
            x: data.houseprice_choropleth_state.data.x,
            y: yAxisInNumber,
          },
        },
      },
    };
  }
);

export default HousePrices;
