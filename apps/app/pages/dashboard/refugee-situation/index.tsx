import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { Metadata } from "datagovmy-ui/components";
import RefugeeSituationDashboard from "@dashboards/demography/refugee-situation";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const RefugeeSituation: Page = ({
  meta,
  barmeter,
  choropleth,
  last_updated,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-refugee-situation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RefugeeSituationDashboard
        barmeter={barmeter}
        choropleth={choropleth}
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-refugee-situation", async () => {
  const { data } = await get("/dashboard", { dashboard: "unhcr" });

  return {
    notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
    props: {
      meta: {
        id: "dashboard-refugee-situation",
        type: "dashboard",
        category: "demography",
        agency: "UNHCR",
      },
      barmeter: data.barmeter,
      choropleth: data.choropleth,
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default RefugeeSituation;
