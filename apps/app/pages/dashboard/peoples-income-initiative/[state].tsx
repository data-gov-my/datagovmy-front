import { GetStaticPaths, GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import PeoplesIncomeInitiativeDashboard from "@dashboards/government-programs/peoples-income-initiative";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { STATES } from "@lib/constants";

const PeoplesIncomeInitiativeState: Page = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peoples-income-initiative", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PeoplesIncomeInitiativeDashboard
        choropleth={choropleth}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </>
  );
};

PeoplesIncomeInitiativeState.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown
        url={routes.PEOPLES_INCOME_INITIATIVE}
        currentState={props.params.state}
        hideOnScroll
      />
    }
  >
    <StateModal state={props.params.state} url={routes.PEOPLES_INCOME_INITIATIVE} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: Array<any> = [];
  STATES.forEach(state => {
    paths = paths.concat([
      {
        params: {
          state: state.key,
        },
      },
      {
        params: {
          state: state.key,
        },
        locale: "ms-MY",
      },
    ]);
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-peoples-income-initiative",
  async ({ params }) => {
    const { data } = await get("/dashboard", {
      dashboard: "peoples_income_initiative",
      state: params?.state,
    });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-peoples-income-initiative",
          type: "dashboard",
          category: "government-programs",
          agency: "EPU",
        },
        last_updated: new Date().valueOf(),
        params: params,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
        choropleth: data.choropleth,
      },
    };
  }
);

export default PeoplesIncomeInitiativeState;