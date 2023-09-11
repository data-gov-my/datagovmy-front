import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import BusinessCreationDestructionDashboard from "@dashboards/economy/business-creation-destruction";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import Layout from "@components/Layout";
import { clx } from "datagovmy-ui/helpers";
import { body } from "datagovmy-ui/configs/font";
import { routes } from "@lib/routes";
import { CountryAndStates } from "datagovmy-ui/constants";

const BusinessCreationDestruction: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-business-creation-destruction"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={
          params.state ? CountryAndStates[params.state].concat(" - ", t("header")) : t("header")
        }
        description={t("description")}
        keywords={""}
      />
      <BusinessCreationDestructionDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        params={params}
      />
    </AnalyticsProvider>
  );
};

BusinessCreationDestruction.layout = (page, props) => {
  return (
    <WindowProvider>
      <Layout
        className={clx(body.variable, "font-sans")}
        stateSelector={
          <StateDropdown
            width="w-max xl:w-64"
            url={routes.BUSINESS_CREATION_DESTRUCTION}
            currentState={props.params.state}
            hideOnScroll
          />
        }
      >
        <StateModal state={props.params.state} url={routes.BUSINESS_CREATION_DESTRUCTION} />
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
  "dashboard-business-creation-destruction",
  async ({ params }) => {
    const state = params?.state ? params.state[0] : "mys";
    const { data } = await get("/dashboard", { dashboard: "business_creation", state: state });

    return {
      props: {
        meta: {
          id: "dashboard-business-creation-destruction",
          type: "dashboard",
          category: "demography",
          agency: "SSM",
        },
        last_updated: data.data_last_updated,
        params: { state: state },
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default BusinessCreationDestruction;
