/**
 * Covid Vaccination Page <State>
 */
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import CovidVaccinationDashboard from "@dashboards/healthcare/covid-vaccination";
import { CountryAndStates, STATES } from "@lib/constants";
import { get } from "@lib/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { useTranslation } from "next-i18next";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { JSXElementConstructor, ReactElement } from "react";
import Fonts from "@config/font";

const CovidVaccinationState = ({
  lastUpdated,
  waffle,
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
        description={t("dashboard-covid-vaccination:description")}
        keywords=""
      />
      <CovidVaccinationDashboard
        lastUpdated={lastUpdated}
        waffle={waffle}
        barmeter={barmeter}
        timeseries={timeseries}
        statistics={statistics}
      />
    </>
  );
};

CovidVaccinationState.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout
    className={[Fonts.body.variable, "font-sans"].join(" ")}
    stateSelector={
      <StateDropdown
        url={routes.COVID_VACCINATION}
        currentState={(useRouter().query.state as string) ?? "mys"}
        exclude={["kvy"]}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.COVID_VACCINATION} exclude={["kvy"]} />
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
  const i18n = await serverSideTranslations(
    locale!,
    ["common", "dashboard-covid-vaccination"],
    null,
    ["en-GB", "ms-MY"]
  );
  const { data } = await get("/dashboard", { dashboard: "covid_vax", state: params?.state });

  return {
    props: {
      ...i18n,
      lastUpdated: new Date().valueOf(),
      waffle: data.waffle,
      barmeter: data.bar_chart,
      timeseries: data.timeseries,
      statistics: data.statistics,
      state: params?.state,
    },
  };
};

export default CovidVaccinationState;
