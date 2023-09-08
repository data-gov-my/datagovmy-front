import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import ElectronicPaymentsLayout from "@dashboards/financial-sector/electronic-payments/layout";
import ElectronicPaymentsTimeseries from "@dashboards/financial-sector/electronic-payments/timeseries";

const ElectronicPayments: Page = ({
  last_updated,
  meta,
  epayment_systems_timeseries,
  epayment_systems_timeseries_callout,
  epayment_instruments_timeseries,
  epayment_instruments_timeseries_callout,
  epayment_channels_timeseries,
  epayment_channels_timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-electronic-payments"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectronicPaymentsLayout last_updated={last_updated}>
        {tab_index => (
          <>
            {
              {
                instruments: (
                  <ElectronicPaymentsTimeseries
                    series="instruments"
                    timeseries={epayment_instruments_timeseries}
                    timeseries_callout={epayment_instruments_timeseries_callout}
                  />
                ),
                systems: (
                  <ElectronicPaymentsTimeseries
                    series="systems"
                    timeseries={epayment_systems_timeseries}
                    timeseries_callout={epayment_systems_timeseries_callout}
                  />
                ),
                channels: (
                  <ElectronicPaymentsTimeseries
                    series="channels"
                    timeseries={epayment_channels_timeseries}
                    timeseries_callout={epayment_channels_timeseries_callout}
                  />
                ),
              }[tab_index]
            }
          </>
        )}
      </ElectronicPaymentsLayout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-electronic-payments",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "epayment" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-electronic-payments",
          type: "dashboard",
          category: "financial-sector",
          agency: "BNM",
        },
        last_updated: data.data_last_updated,
        epayment_systems_timeseries: data.epayment_systems_timeseries,
        epayment_systems_timeseries_callout: data.epayment_systems_timeseries_callout,
        epayment_channels_timeseries: data.epayment_channels_timeseries,
        epayment_channels_timeseries_callout: data.epayment_channels_timeseries_callout,
        epayment_instruments_timeseries: data.epayment_instruments_timeseries,
        epayment_instruments_timeseries_callout: data.epayment_instruments_timeseries_callout,
      },
    };
  }
);

export default ElectronicPayments;
