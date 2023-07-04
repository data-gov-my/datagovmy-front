import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionTriviaDashboard from "@dashboards/democracy/election-explorer/trivia";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@hooks/useWindow";
import { get } from "@lib/api";
import { CountryAndStates, STATES } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const ElectionTriviaState: Page = ({
  dun_bar,
  last_updated,
  meta,
  params,
  parlimen_bar,
  table_top,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
      <ElectionLayout last_updated={last_updated}>
        <ElectionTriviaDashboard
          dun_bar={dun_bar}
          params={params}
          parlimen_bar={parlimen_bar}
          table_top={table_top}
        />
      </ElectionLayout>
    </AnalyticsProvider>
  );
};

ElectionTriviaState.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(Fonts.body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          url={routes.ELECTION_EXPLORER.concat("/trivia")}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.ELECTION_EXPLORER.concat("/trivia")} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticPaths: GetStaticPaths = async () => {
  // let paths: Array<any> = [];
  // STATES.forEach(state => {
  //   paths = paths.concat([
  //     {
  //       params: {
  //         state: state.key,
  //       },
  //     },
  //     {
  //       params: {
  //         state: state.key,
  //       },
  //       locale: "ms-MY",
  //     },
  //   ]);
  // });
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-election-explorer",
  async ({ params }) => {
    const { data } = await get("/dashboard", {
      dashboard: "election_trivia",
      state: params?.state,
    });

    return {
      notFound: false,
      props: {
        last_updated: data.data_last_updated,
        meta: {
          id: "dashboard-election-explorer",
          type: "dashboard",
          category: "democracy",
          agency: "SPR",
        },
        dun_bar: data.dun_bar ?? {},
        params: params,
        parlimen_bar: data.parlimen_bar.data,
        table_top: data.table_top.data,
      },
    };
  }
);

export default ElectionTriviaState;
