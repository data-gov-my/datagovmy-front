import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import COVID19Dashboard from "@dashboards/covid-19";

import { useTranslation } from "next-i18next";
import { get } from "@lib/api";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";

const COVID19: Page = ({
  meta,
  params,
  last_updated,
  snapshot_bar,
  snapshot_graphic,
  timeseries,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-19", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <COVID19Dashboard
        params={params}
        last_updated={last_updated}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        timeseries={timeseries}
        statistics={statistics}
      />
    </>
  );
};

COVID19.layout = page => (
  <Layout
    stateSelector={
      <StateDropdown url={routes.COVID} currentState={"mys"} exclude={["kvy"]} hideOnScroll />
    }
  >
    <StateModal exclude={["kvy"]} url={routes.COVID} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-covid-19", "common"],
  async () => {
    const { data } = await get("/dashboard", { dashboard: "covid_epid", state: "mys" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-covid-19",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
        params: { state: "mys" },
        last_updated: data.data_last_updated,
        snapshot_bar: data.snapshot_bar,
        snapshot_graphic: data.snapshot_graphic,
        timeseries: data.timeseries,
        statistics: data.statistics,
      },
    };
  }
);

export default COVID19;
