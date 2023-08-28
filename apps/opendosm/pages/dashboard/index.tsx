import Dashboard from "@dashboards/index";
import { Metadata, Progress } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { routes } from "@lib/routes";

const DashboardIndex: Page = ({ dashboards }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "common"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      <Progress />
      <Dashboard dashboards={dashboards} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboards", async () => {
  const data = {
    data_as_of: "2023-06-19 23:59",
    data: [
      {
        name: "composite-index",
        agency: "dosm",
        route: routes.COMPOSITE_INDEX,
      },
      {
        name: "consumer-prices",
        agency: "dosm",
        route: routes.CONSUMER_PRICES,
      },
      {
        name: "gdp",
        agency: "dosm",
        route: routes.GDP,
      },
      {
        name: "industrial-production",
        agency: "dosm",
        route: routes.INDUSTRIAL_PRODUCTION,
      },
      {
        name: "kawasanku",
        agency: "dosm",
        route: routes.KAWASANKU,
      },
      {
        name: "labour-market",
        agency: "dosm",
        route: routes.LABOUR_MARKET,
      },
      {
        name: "producer-prices",
        agency: "dosm",
        route: routes.PRODUCER_PRICES,
      },
      {
        name: "wholesale-retail",
        agency: "dosm",
        route: routes.WHOLESALE_RETAIL,
      },
      {
        name: "iip",
        agency: "bpan",
        route: routes.IIP,
      },
      {
        name: "bop",
        agency: "bpan",
        route: routes.BOP,
      },
      {
        name: "manufacturing-statistics",
        agency: "bppib",
        route: routes.MANUFACTURING_STATISTICS,
      },
      {
        name: "labour-productivity",
        agency: "dosm",
        route: routes.LABOUR_PRODUCTIVITY,
      },
      {
        name: "formal-sector-wages",
        agency: "dosm",
        route: routes.FORMAL_SECTOR_WAGES,
      },
    ],
  };

  return {
    props: {
      meta: {
        id: "dashboard-index",
        type: "misc",
        category: null,
        agency: null,
      },
      dashboards: data,
    },
  };
});

export default DashboardIndex;
