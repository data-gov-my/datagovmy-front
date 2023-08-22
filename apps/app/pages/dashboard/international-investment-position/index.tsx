import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Hero, Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import InternationalInvestmentPositionDashboard from "@dashboards/national-accounts/iip";

const InternationalInvestmentPosition: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation([""]);
  console.log(last_updated);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={"HELLO WORLD"} description={"huhuhuhuh"} keywords={""} />
      <InternationalInvestmentPositionDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("", async () => {
  const { data } = await get("/dashboard", { dashboard: "iip" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-iip",
        type: "dashboard",
        category: "national-accounts",
        agency: "bnm",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default InternationalInvestmentPosition;
