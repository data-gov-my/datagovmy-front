import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/demography/birthday-explorer";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { WindowProvider } from "@hooks/useWindow";

const BirthdayExplorer = ({
  meta,
  last_updated,
  timeseries,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-birthday-explorer", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WindowProvider>
        <BirthdayExplorerDashboard last_updated={last_updated} timeseries={timeseries} />
      </WindowProvider>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-birthday-explorer", "catalogue"],
  async () => {
    const { data } = await get("/explorer", { explorer: "BIRTHDAY_POPULARITY", state: "mys" });
    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        last_updated: data.data_last_updated,
        meta: {
          id: "dashboard-birthday-explorer",
          type: "dashboard",
          category: "demography",
          agency: "JPN",
        },
        timeseries: data.timeseries,
      },
    };
  }
);

export default BirthdayExplorer;
