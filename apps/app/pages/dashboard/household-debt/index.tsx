import { Metadata } from "datagovmy-ui/components";
import HouseholdDebtDashboard from "@dashboards/economy/household-debt";
import { get } from "datagovmy-ui/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const HouseholdDebt = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-household-debt"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <HouseholdDebtDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-household-debt", async () => {
  const { data } = await get("/dashboard", { dashboard: "household_debt" });

  return {
    props: {
      meta: {
        id: "dashboard-household-debt",
        type: "dashboard",
        category: "economy",
        agency: "BNM",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default HouseholdDebt;
