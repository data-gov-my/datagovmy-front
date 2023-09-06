import Layout from "@components/Layout";
import DrugAddictionDashboard from "@dashboards/public-safety/drug-addiction";
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

const DrugAddiction: Page = ({
  barmeter,
  barmeter_data_as_of,
  last_updated,
  meta,
  params,
  timeseries,
  timeseries_data_as_of,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-drug-addiction", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={
          params.state ? CountryAndStates[params.state].concat(" - ", t("header")) : t("header")
        }
        description={t("description")}
        keywords={""}
      />
      <DrugAddictionDashboard
        barmeter={barmeter}
        barmeter_data_as_of={barmeter_data_as_of}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_data_as_of={timeseries_data_as_of}
      />
    </AnalyticsProvider>
  );
};

DrugAddiction.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.DRUG_ADDICTION}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.DRUG_ADDICTION} />
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
  "dashboard-drug-addiction",
  async ({ params }) => {
    const state = params?.state ? params.state[0] : "mys";
    const { data } = await get("/dashboard", { dashboard: "drug_addiction" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-drug-addiction",
          type: "dashboard",
          category: "public-safety",
          agency: "AADK",
        },
        barmeter: data.barmeter.data[state],
        barmeter_data_as_of: data.barmeter.data_as_of,
        last_updated: data.data_last_updated,
        params: { state },
        timeseries: data.timeseries.data[state],
        timeseries_data_as_of: data.timeseries.data_as_of,
      },
    };
  }
);

export default DrugAddiction;
