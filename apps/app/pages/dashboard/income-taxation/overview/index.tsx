import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import IncomeTaxationLayout from "@dashboards/economy/income-taxation/layout";
import IncomeTaxationDashboard from "@dashboards/economy/income-taxation/overview";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const IncomeTaxation: Page = ({
  last_updated,
  meta,
  stacked_bar,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <IncomeTaxationLayout last_updated={last_updated}>
        <IncomeTaxationDashboard stacked_bar={stacked_bar} last_updated={last_updated} />
      </IncomeTaxationLayout>
    </AnalyticsProvider>
  );
};
// Disabled
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
      stacked_bar: data.stacked_bar,
    },
  };
});

export default IncomeTaxation;
