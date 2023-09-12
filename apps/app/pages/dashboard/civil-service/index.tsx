import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CivilServiceDashboard from "@dashboards/public-finances/civil-service";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const CivilService: Page = ({
  agencies,
  barmeter,
  choropleth,
  last_updated,
  meta,
  pyramid,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CivilServiceDashboard
        agencies={agencies}
        barmeter={barmeter}
        choropleth={choropleth}
        last_updated={last_updated}
        pyramid={pyramid}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-civil-service", async () => {
  // const { data } = await get("/dashboard", { dashboard: "civil_service" });

  return {
    notFound: true,
    props: {
      meta: {
        id: "dashboard-civil-service",
        type: "dashboard",
        category: "public-finances",
        agency: "JPA",
      },
      agencies: [],
      barmeter: [], //data.barmeter,
      choropleth: [], //data.choropleth,
      last_updated: Date.now(),
      pyramid: [],
      timeseries: [], //data.timeseries,
      timeseries_callout: [], //data.timeseries_callout,
    },
  };
});

export default CivilService;
