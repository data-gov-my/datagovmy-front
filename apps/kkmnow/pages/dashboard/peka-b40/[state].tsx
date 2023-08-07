import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import PekaB40Dashboard from "@dashboards/peka-b40";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { CountryAndStates } from "datagovmy-ui/constants";

import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const PekaB40State: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peka-b40", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
      <PekaB40Dashboard
        params={params}
        last_updated={last_updated}
        timeseries={timeseries}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

PekaB40State.layout = (page, props) => (
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.PEKA_B40}
          currentState={props?.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.PEKA_B40} />
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
  ["dashboard-peka-b40", "common"],
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "peka_b40", state: params?.state });

    return {
      props: {
        meta: {
          id: "dashboard-peka-b40",
          type: "dashboard",
          category: "healthcare",
          agency: "PHCorp",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        params: params,
        choropleth: data.choropleth_malaysia,
      },
    };
  }
);

export default PekaB40State;
