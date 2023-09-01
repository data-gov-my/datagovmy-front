import Layout from "@components/Layout";
import JoblessClaimsDashboard from "@dashboards/economy/jobless-claims";
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

const JoblessClaims: Page = ({
  barmeter,
  last_updated,
  meta,
  params,
  pyramid,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-jobless-claims", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={
          params.state ? CountryAndStates[params.state].concat(" - ", t("header")) : t("header")
        }
        description={t("description")}
        keywords={""}
      />
      <JoblessClaimsDashboard
        barmeter={barmeter}
        last_updated={last_updated}
        params={params}
        pyramid={pyramid}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

JoblessClaims.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.JOBLESS_CLAIMS}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.JOBLESS_CLAIMS} />
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
  "dashboard-jobless-claims",
  async ({ params }) => {
    const state = params?.state ? params.state[0] : "mys";
    const { data } = await get("/dashboard", { dashboard: "perkeso", state });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-jobless-claims",
          type: "dashboard",
          category: "economy",
          agency: "PERKESO",
        },
        barmeter: data.barmeter.data,
        last_updated: data.data_last_updated,
        params: { state },
        pyramid: data.pyramid_data,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default JoblessClaims;
