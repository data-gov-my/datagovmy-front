import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import InternationalReservesDashboard from "@dashboards/financial-sector/international-reserves";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const InternationalReserves: Page = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-international-reserves", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <InternationalReservesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-international-reserves",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "international_reserves" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-international-reserves",
          type: "dashboard",
          category: "financial-sector",
          agency: "BNM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callouts: data.statistics,
      },
    };
  }
);

export default InternationalReserves;
