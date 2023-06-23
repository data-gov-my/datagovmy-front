import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/demography/birthday-explorer";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const BirthdayExplorer = ({ meta, timeseries }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-birthday-explorer", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <BirthdayExplorerDashboard timeseries={timeseries} />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-birthday-explorer", async () => {
  const { data } = await get("/explorer", { explorer: "BIRTHDAY_POPULARITY", state: "mys" });
  return {
    props: {
      meta: {
        id: "dashboard-birthday-explorer",
        type: "dashboard",
        category: "demography",
        agency: "JPN",
      },
      timeseries: {
        data: {
          x: data.x,
          y: data.y,
        },
      },
    },
  };
});

export default BirthdayExplorer;
