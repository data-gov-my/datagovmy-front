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

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboards", "opendosm-home"],
  async () => {
    const data = {
      data_as_of: "2023-06-19 23:59",
      data: [
        {
          name: "bop",
          division: "bpib",
          route: routes.BOP,
        },
        {
          name: "composite-index",
          division: "bpe",
          route: routes.COMPOSITE_INDEX,
        },
        {
          name: "construction-statistics",
          division: "bppib",
          route: routes.CONSTRUCTION_STATISTICS,
        },
        {
          name: "consumer-prices",
          division: "bphpp",
          route: routes.CONSUMER_PRICES,
        },
        {
          name: "formal-sector-wages",
          division: "mbls",
          route: routes.FORMAL_SECTOR_WAGES,
        },
        {
          name: "gdp",
          division: "bpan",
          route: routes.GDP,
        },
        {
          name: "household-income-expenditure",
          division: "bphpp",
          route: routes.HOUSEHOLD_INCOME_EXPENDITURE,
        },
        {
          name: "industrial-production",
          division: "bppib",
          route: routes.INDUSTRIAL_PRODUCTION,
        },
        {
          name: "iip",
          division: "bpan",
          route: routes.IIP,
        },
        {
          name: "kawasanku",
          division: "bpm",
          route: routes.KAWASANKU,
        },
        {
          name: "labour-market",
          division: "mbls",
          route: routes.LABOUR_MARKET,
        },
        {
          name: "labour-productivity",
          division: "mbls",
          route: routes.LABOUR_PRODUCTIVITY,
        },
        {
          name: "manufacturing-statistics",
          division: "bppib",
          route: routes.MANUFACTURING_STATISTICS,
        },
        {
          name: "population",
          division: "bppd",
          route: routes.POPULATION,
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
          name: "wholesale-retail",
          division: "bpp",
          route: routes.WHOLESALE_RETAIL,
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
