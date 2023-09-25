import Dashboard from "@dashboards/index";
import { routes } from "@lib/routes";
import { Metadata, Progress } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const DashboardIndex: Page = ({ dashboards }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.dashboards")}
        description={t("description", { agency: t("agencies:dosm.abbr"), context: "agency" })}
        keywords={""}
      />
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
          id: "dashboard-kawasanku",
          name: "kawasanku",
          division: "bipd",
          route: routes.KAWASANKU,
        },
        {
          id: "dashboard-population",
          name: "population",
          division: "bppd",
          route: routes.POPULATION,
        },
        {
          id: "dashboard-life-expectancy",
          name: "life-expectancy",
          division: "bppd",
          route: routes.LIFE_EXPECTANCY,
        },
        {
          id: "dashboard-household-income-expenditure",
          name: "household-income-expenditure",
          division: "bphpp",
          route: routes.HOUSEHOLD_INCOME_EXPENDITURE,
          colour: AKSARA_COLOR.PRIMARY,
        },
        {
          id: "dashboard-gdp",
          name: "gdp",
          division: "bpan",
          route: routes.GDP,
        },
        {
          id: "dashboard-iip",
          name: "iip",
          division: "bpip",
          route: routes.IIP,
        },
        {
          id: "dashboard-bop",
          name: "bop",
          division: "bpip",
          route: routes.BOP,
        },
        {
          id: "dashboard-external-trade",
          name: "external-trade",
          division: "bppa",
          route: routes.EXTERNAL_TRADE,
        },
        {
          id: "dashboard-consumer-prices",
          name: "consumer-prices",
          division: "bphpp",
          route: routes.CONSUMER_PRICES,
        },
        {
          id: "dashboard-producer-prices",
          name: "producer-prices",
          division: "bphpp",
          route: routes.PRODUCER_PRICES,
        },
        {
          id: "dashboard-services-producer-prices",
          name: "services-producer-prices",
          division: "bphpp",
          route: routes.SERVICES_PRODUCER_PRICES,
        },
        {
          id: "dashboard-labour-market",
          name: "labour-market",
          division: "mbls",
          route: routes.LABOUR_MARKET,
        },
        {
          id: "dashboard-formal-sector-wages",
          name: "formal-sector-wages",
          division: "mbls",
          route: routes.FORMAL_SECTOR_WAGES,
        },
        {
          id: "dashboard-labour-productivity",
          name: "labour-productivity",
          division: "mbls",
          route: routes.LABOUR_PRODUCTIVITY,
        },
        {
          id: "dashboard-services-statistics",
          name: "services-statistics",
          division: "bpp",
          route: routes.SERVICES_STATISTICS,
        },
        {
          id: "dashboard-wholesale-retail",
          name: "wholesale-retail",
          division: "bpp",
          route: routes.WHOLESALE_RETAIL,
        },
        {
          id: "dashboard-manufacturing-statistics",
          name: "manufacturing-statistics",
          division: "bppib",
          route: routes.MANUFACTURING_STATISTICS,
        },
        {
          id: "dashboard-industrial-production",
          name: "industrial-production",
          division: "bppib",
          route: routes.INDUSTRIAL_PRODUCTION,
        },
        {
          id: "dashboard-construction-statistics",
          name: "construction-statistics",
          division: "bppib",
          route: routes.CONSTRUCTION_STATISTICS,
        },
        {
          id: "dashboard-composite-index",
          name: "composite-index",
          division: "bpe",
          route: routes.COMPOSITE_INDEX,
        },
        {
          id: "dashboard-exchange-rates",
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
