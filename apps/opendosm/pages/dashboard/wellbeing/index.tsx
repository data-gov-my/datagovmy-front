import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import WellbeingDashboard from "@dashboards/wellbeing";

const Wellbeing: Page = ({
  last_updated,
  next_update,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-wellbeing"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WellbeingDashboard
        last_updated={last_updated}
        next_update={next_update}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-wellbeing", async () => {
  const { data } = await get("/dashboard", { dashboard: "wellbeing" });

  return {
    notFound: false,
    props: {
      last_updated: data.data_last_updated,
      next_update: data.data_next_update,
      meta: {
        id: "dashboard-wellbeing",
        type: "dashboard",
        category: "demography",
        agency: "DOSM",
      },
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default Wellbeing;
