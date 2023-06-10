import { GetStaticProps, GetStaticPaths } from "next";
import type { InferGetStaticPropsType } from "next";
import type { Page } from "@lib/types";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import DrugAddictionDashboard from "@dashboards/drug-addiction";
import { StateDropdown, StateModal } from "@components/index";
import Layout from "@components/Layout";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { ReactNode } from "react";

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
    <StateModal url={routes.DRUG} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  //   let paths: Array<any> = [];
  //   STATES.forEach(state => {
  //     paths = paths.concat([
  //       {
  //         params: {
  //           state: state.key,
  //         },
  //       },
  //       {
  //         params: {
  //           state: state.key,
  //         },
  //         locale: "ms-MY",
  //       },
  //     ]);
  //   });
  return {
    paths: [],
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const state = params!.state as string;
  const { data } = await get("/dashboard", { dashboard: "drug_dashboard" });

  return {
    notFound: true,
  };

  //   return {
  //     props: {
  //       ...i18n,
  //       state: state,
  //       last_updated: new Date().valueOf(),
  //       timeseries: {
  //         data_as_of: data.timeseries.data_as_of,
  //         data: data.timeseries.data[state],
  //       },
  //       barmeter: {
  //         data_as_of: data.bar_chart.data_as_of,
  //         data: data.bar_chart.data[state],
  //       },
  //     },
  //     revalidate: 60 * 60 * 24, // 1 day (in seconds)
  //   };
};

export default DrugAddictionState;
