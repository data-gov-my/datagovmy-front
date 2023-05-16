import { GetStaticPaths, GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import FireandRescueDashboard from "@dashboards/public-safety/fire-and-rescue";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { STATES } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";

const FireandRescueState: Page = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-fire-and-rescue", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <FireandRescueDashboard
        choropleth={choropleth}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </>
  );
};
FireandRescueState.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown url={routes.FIRE_RESCUE} currentState={props.params.state} hideOnScroll />
    }
  >
    <StateModal state={props.params.state} url={routes.FIRE_RESCUE} />
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
  "dashboard-fire-and-rescue",
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "bomba", state: params?.state });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-fire-and-rescue",
          type: "dashboard",
          category: "public-safety",
          agency: "BOMBA",
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

export default FireandRescueState;
