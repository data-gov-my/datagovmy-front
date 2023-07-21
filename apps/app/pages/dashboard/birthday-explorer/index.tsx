import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/demography/birthday-explorer";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { WindowProvider } from "@hooks/useWindow";

const BirthdayExplorer = ({ meta, timeseries }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-birthday-explorer", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WindowProvider>
        <BirthdayExplorerDashboard timeseries={timeseries} />
      </WindowProvider>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-birthday-explorer", async () => {
  const { data } = await get("/dashboard", { dashboard: "birthday_popularity", state: "mys" });
  return {
    props: {
      meta: {
        id: "dashboard-birthday-explorer",
        type: "dashboard",
        category: "demography",
        agency: "JPN",
      },
      timeseries: data.timeseries,
    },
  };
});

export default BirthdayExplorer;
