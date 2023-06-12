import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CivilServiceDashboard from "@dashboards/public-finances/civil-service";
import { withi18n } from "@lib/decorators";

const CivilService: Page = ({
  agencies,
  barmeter,
  choropleth,
  last_updated,
  pyramid,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common"]);

  return (
    <>
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
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-civil-service", async () => {
  const { data } = await get("/dashboard", { dashboard: "unhcr" });
  const { data: timeseries } = await get("/dashboard", { dashboard: "immigration" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-civil-service",
        type: "dashboard",
        category: "public-finances",
        agency: "JPA",
      },
      agencies: [],
      barmeter: data.barmeter,
      choropleth: data.choropleth,
      last_updated: Date.now(),
      pyramid: [],
      timeseries: timeseries.timeseries,
      timeseries_callout: timeseries.timeseries_callout,
    },
  };
});

export default CivilService;
