import { GetStaticProps, GetStaticPaths } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import { CountryAndStates, STATES } from "@lib/constants";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import DrugAddictionDashboard from "@dashboards/drug-addiction";
import { StateDropdown, StateModal } from "datagovmy-ui/components";
import Layout from "@components/Layout";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { withi18n } from "datagovmy-ui/decorators";

const DrugAddictionState: Page = ({
  last_updated,
  timeseries,
  barmeter,
  state,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("nav.megamenu.dashboards.drug"))}
        description={t("drug.description")}
        keywords={""}
      />
      <DrugAddictionDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        barmeter={barmeter}
      />
    </>
  );
};

DrugAddictionState.layout = (page: ReactNode) => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.DRUG}
        currentState={(useRouter().query.state as string) ?? "mys"}
        hideOnScroll
      />
    }
  >
    {/* <StateModal url={routes.DRUG} /> */}
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  return {
    paths: [],
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = withi18n("common", async ({ params }) => {
  // const state = params!.state as string;
  // const { data } = await get("/dashboard", { dashboard: "drugs" });

  return {
    notFound: true,
    props: {
      // state: state,
      // last_updated: new Date().valueOf(),
      // timeseries: {
      //   data_as_of: data.timeseries.data_as_of,
      //   data: data.timeseries.data[state],
      // },
      // barmeter: {
      //   data_as_of: data.bar_chart.data_as_of,
      //   data: data.bar_chart.data[state],
      // },
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default DrugAddictionState;
