import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ReserveMoneyDashboard from "@dashboards/financial-sector/reserve-money";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const ReserveMoney: Page = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-reserve-money", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ReserveMoneyDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-reserve-money", async () => {
  const { data } = await get("/dashboard", { dashboard: "reserves" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-reserve-money",
        type: "dashboard",
        category: "financial-sector",
        agency: "BNM",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default ReserveMoney;
