import Layout from "@components/Layout";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionTriviaDashboard from "@dashboards/democracy/election-explorer/trivia";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { get } from "datagovmy-ui/api";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const ElectionTrivia: Page = ({
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
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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

ElectionTrivia.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.ELECTION_EXPLORER.concat("/trivia")}
          currentState={props.params.state}
          exclude={["kul", "lbn", "pjy"]}
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

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  const { data } = await get("/dashboard", {
    dashboard: "election_trivia",
    state: "mys",
  });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-election-explorer",
        type: "dashboard",
        category: "democracy",
        agency: "SPR",
      },
      dun_bar: data.dun_bar,
      last_updated: data.data_last_updated,
      params: { state: "mys" },
      parlimen_bar: data.parlimen_bar.data,
      table_top: data.table_top.data,
    },
  };
});

export default ElectionTrivia;
