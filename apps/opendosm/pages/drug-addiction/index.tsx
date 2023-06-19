import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
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

/**
 * TODO @irfan
 */

const DrugAddiction: Page = ({
  last_updated,
  timeseries,
  barmeter,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.drug")}
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

DrugAddiction.layout = (page: ReactNode) => (
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
export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard", { dashboard: "drugs" });

  return {
    notFound: true,
    props: {
      // last_updated: new Date().valueOf(),
      // timeseries: {
      //   data_as_of: data.timeseries.data_as_of,
      //   data: data.timeseries.data.mys,
      // },
      // barmeter: {
      //   data_as_of: data.bar_chart.data_as_of,
      //   data: data.bar_chart.data.mys,
      // },
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default DrugAddiction;
