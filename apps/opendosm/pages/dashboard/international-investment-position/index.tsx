import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import InternationalInvestmentPositionDashboard from "@dashboards/international-investment-position";

const InternationalInvestmentPosition: Page = ({
  last_updated,
  next_update,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-iip", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <InternationalInvestmentPositionDashboard
        last_updated={last_updated}
        next_update={next_update}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-iip", async () => {
  const { data } = await get("/dashboard", { dashboard: "iip" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-iip",
        type: "dashboard",
        category: "national-accounts",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      next_update: data.data_next_update,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default InternationalInvestmentPosition;
