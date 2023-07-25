/**
 * Covid Vaccination Page <State>
 */
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import CovidVaccinationDashboard from "@dashboards/covid-vaccination";
import { CountryAndStates, STATES } from "@lib/constants";
import { get } from "@lib/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { useTranslation } from "next-i18next";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { JSXElementConstructor, ReactElement } from "react";
import { sortMsiaFirst } from "@lib/helpers";

const CovidVaccinationState = ({
  last_updated,
  waffle,
  table,
  barmeter,
  timeseries,
  statistics,
  state,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("nav.megamenu.dashboards.covid_19_vax"))}
        description={t("vaccination.title_description1")}
        keywords={""}
      />
      <CovidVaccinationDashboard
        last_updated={last_updated}
        waffle={waffle}
        table={table}
        barmeter={barmeter}
        timeseries={timeseries}
        statistics={statistics}
      />
    </>
  );
};

CovidVaccinationState.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.COVID_VAX}
        currentState={(useRouter().query.state as string) ?? "mys"}
        exclude={["kvy"]}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.COVID_VAX} exclude={["kvy"]} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  let paths: Array<any> = [];
  STATES.filter(item => !["kvy"].includes(item.key)).forEach(state => {
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

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "covid_vax", state: params?.state });
  data.snapshot.data = sortMsiaFirst(data.snapshot.data, "state");

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      waffle: data.waffle,
      barmeter: data.bar_chart,
      table: data.snapshot,
      timeseries: data.timeseries,
      statistics: data.statistics,
      state: params?.state,
    },
    revalidate: 300,
  };
};

export default CovidVaccinationState;
