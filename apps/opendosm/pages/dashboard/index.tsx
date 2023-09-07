import Dashboard from "@dashboards/index";
import { Metadata, Progress } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { routes } from "@lib/routes";
import { AKSARA_COLOR } from "datagovmy-ui/constants";

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

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboards", "opendosm-home"],
  async () => {
    const data = {
      data_as_of: "2023-06-19 23:59",
      data: [
        {
          name: "kawasanku",
          division: "bipd",
          route: routes.KAWASANKU,
        },
        {
          name: "population",
          division: "bppd",
          route: routes.POPULATION,
        },
        {
          name: "household-income-expenditure",
          division: "bphpp",
          route: routes.HOUSEHOLD_INCOME_EXPENDITURE,
          colour: AKSARA_COLOR.PRIMARY,
        },
        {
          name: "gdp",
          division: "bpan",
          route: routes.GDP,
        },
        {
          name: "iip",
          division: "bpib",
          route: routes.IIP,
        },
        {
          name: "bop",
          division: "bpib",
          route: routes.BOP,
        },
        {
          name: "external-trade",
          division: "bppa",
          route: routes.EXTERNAL_TRADE,
        },
        {
          name: "consumer-prices",
          division: "bphpp",
          route: routes.CONSUMER_PRICES,
        },
        {
          name: "producer-prices",
          division: "bphpp",
          route: routes.PRODUCER_PRICES,
        },
        {
          name: "services-producer-prices",
          division: "bphpp",
          route: routes.SERVICES_PRODUCER_PRICES,
        },
        {
          name: "labour-market",
          division: "mbls",
          route: routes.LABOUR_MARKET,
        },
        {
          name: "formal-sector-wages",
          division: "mbls",
          route: routes.FORMAL_SECTOR_WAGES,
        },
        {
          name: "labour-productivity",
          division: "mbls",
          route: routes.LABOUR_PRODUCTIVITY,
        },
        {
          name: "services-statistics",
          division: "bpp",
          route: routes.SERVICES_STATISTICS,
        },
        {
          name: "wholesale-retail",
          division: "bpp",
          route: routes.WHOLESALE_RETAIL,
        },
        {
          name: "manufacturing-statistics",
          division: "bppib",
          route: routes.MANUFACTURING_STATISTICS,
        },
        {
          name: "industrial-production",
          division: "bppib",
          route: routes.INDUSTRIAL_PRODUCTION,
        },
        {
          name: "construction-statistics",
          division: "bppib",
          route: routes.CONSTRUCTION_STATISTICS,
        },
        {
          name: "composite-index",
          division: "bpe",
          route: routes.COMPOSITE_INDEX,
        },
        {
          name: "exchange-rates",
          division: "bipd",
          route: routes.EXCHANGE_RATES,
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
  }
);

export default DashboardIndex;
