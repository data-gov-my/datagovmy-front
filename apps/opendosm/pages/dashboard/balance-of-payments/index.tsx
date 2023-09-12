import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import BalanceOfPaymentsTimeseries from "@dashboards/balance-of-payments/timeseries";
import BalanceOfPaymentsSnapshot from "@dashboards/balance-of-payments/snapshot";
import BalanceOfPaymentsLayout from "@dashboards/balance-of-payments/layout";

const BalanceOfPayments: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
  bop_snapshot,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-bop", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <BalanceOfPaymentsLayout last_updated={last_updated}>
        {tab_index => (
          <>
            {
              {
                snapshot: <BalanceOfPaymentsSnapshot bop_snapshot={bop_snapshot} />,
                timeseries: (
                  <BalanceOfPaymentsTimeseries
                    timeseries={timeseries}
                    timeseries_callout={timeseries_callout}
                  />
                ),
              }[tab_index]
            }
          </>
        )}
      </BalanceOfPaymentsLayout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-bop", async () => {
  const { data } = await get("/dashboard", { dashboard: "bop" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-bop",
        type: "dashboard",
        category: "national-accounts",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
      bop_snapshot: data.bop_snapshot,
    },
  };
});

export default BalanceOfPayments;
