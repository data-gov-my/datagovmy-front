import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionTriviaDashboard from "@dashboards/democracy/election-explorer/trivia";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { get } from "datagovmy-ui/api";
import { CountryAndStates } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
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
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.ELECTION_EXPLORER.concat("/trivia")}
          exclude={["kul", "lbn", "pjy"]}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal
        state={props.params.state}
        url={routes.ELECTION_EXPLORER.concat("/trivia")}
        exclude={["kul", "lbn", "pjy"]}
      />
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
