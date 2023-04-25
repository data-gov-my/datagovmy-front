import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { CountryAndStates, STATES } from "@lib/constants";
import { useTranslation } from "@hooks/useTranslation";
import { routes } from "@lib/routes";
import Fonts from "@config/font";
import PekaB40Dashboard from "@dashboards/healthcare/peka-b40";
import { withi18n } from "@lib/decorators";

const PekaB40State: Page = ({
  last_updated,
  timeseries,
  state,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-peka-b40"]);

  return (
    <>
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("dashboard-peka-b40:header"))}
        description={t("dashboard-peka-b40:description")}
        keywords={""}
      />
      <PekaB40Dashboard
        last_updated={last_updated}
        timeseries={timeseries}
        choropleth={choropleth}
      />
    </>
  );
};

PekaB40State.layout = (page, props) => (
  <Layout
    className={[Fonts.body.variable, "font-sans"].join(" ")}
    stateSelector={<StateDropdown url={routes.PEKA_B40} currentState={props?.state} hideOnScroll />}
  >
    <StateModal url={routes.PEKA_B40} />
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

export const getStaticProps: GetStaticProps = withi18n("dashboard-peka-b40", async ({ params }) => {
  const { data } = await get("/dashboard", { dashboard: "peka_b40", state: params?.state });

  return {
    props: {
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      state: params?.state ?? "mys",
      choropleth: data.choropleth_malaysia,
    },
    revalidate: 300,
  };
});

export default PekaB40State;
