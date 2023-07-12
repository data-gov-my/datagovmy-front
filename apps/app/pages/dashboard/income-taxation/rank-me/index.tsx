import Metadata from "@components/Metadata";
import IncomeTaxationLayout from "@dashboards/economy/income-taxation/layout";
import IncomeRankDashboard from "@dashboards/economy/income-taxation/rank-me";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";

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
