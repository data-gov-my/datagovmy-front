import { Metadata } from "datagovmy-ui/components";
import IncomeTaxationLayout from "@dashboards/economy/income-taxation/layout";
import IncomeRankDashboard from "@dashboards/economy/income-taxation/rank-me";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";

const IncomeRank: Page = ({
  last_updated,
  meta,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <IncomeTaxationLayout last_updated={last_updated}>
        <IncomeRankDashboard />
      </IncomeTaxationLayout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-income-taxation", async () => {
  const { data } = await get("/dashboard", { dashboard: "income_tax" });
  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-income-taxation",
        type: "dashboard",
        category: "economy",
        agency: "LHDN",
      },
      last_updated: data.data_last_updated,
    },
  };
});

export default IncomeRank;
