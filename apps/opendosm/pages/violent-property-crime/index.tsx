import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CrimeDashboard from "@dashboards/crime";
import { StateDropdown, StateModal } from "datagovmy-ui/components";
import Layout from "@components/Layout";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { withi18n } from "datagovmy-ui/decorators";

const Crime: Page = ({
  last_updated,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.crime")}
        description={t("crime.description")}
        keywords={""}
      />
      <CrimeDashboard last_updated={last_updated} timeseries={timeseries} choropleth={choropleth} />
    </>
  );
};

Crime.layout = (page: ReactNode) => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.CRIME}
        currentState={(useRouter().query.state as string) ?? "mys"}
        exclude={["pjy", "lbn"]}
        hideOnScroll
      />
    }
  >
    {/* <StateModal url={routes.CRIME} exclude={["kvy"]} /> */}
    {page}
  </Layout>
);
export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard", { dashboard: "crime" });

  return {
    notFound: true,
    props: {
      meta: {
        id: "dashboard-crime",
        type: "dashboard",
        category: "social",
        agency: "PDRM",
      },
      last_updated: new Date().valueOf(),
      // timeseries: {
      //   data_as_of: data.timeseries.data_as_of,
      //   data: data.timeseries.data.mys,
      // },
      // choropleth: data.choropleth_malaysia,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default Crime;
