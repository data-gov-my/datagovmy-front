import Metadata from "@components/Metadata";
import { Layout, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import ElectionTriviaDashboard from "@dashboards/democracy/election-explorer/trivia";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const ElectionTrivia: Page = ({
  dun_bar,
  params,
  parlimen_bar,
  table_top,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionTriviaDashboard
        dun_bar={dun_bar}
        params={params}
        parlimen_bar={parlimen_bar}
        table_top={table_top}
      />
    </>
  );
};

ElectionTrivia.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown
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
      params: { state: "mys" },
      parlimen_bar: data.parlimen_bar.data,
      table_top: data.table_top.data,
    },
  };
});

export default ElectionTrivia;
