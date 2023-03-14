import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import Dashboard from "@dashboards/index";
import { get } from "@lib/api";

const DashboardIndex: Page = ({
  timeseries,
  analytics,
}: // query,
// collection,
// total,
// sources,
InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <Metadata title={t("nav.dashboards")} description={""} keywords={""} />
      <Dashboard
        query={{}}
        sources={["All Agencies", "Ministry of Transport", "Ministry of Health"]}
        analytics={analytics}
        timeseries={timeseries}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const { data } = await get("/dashboard", { dashboard: "homepage" });

  return {
    props: {
      ...i18n,
      query: query ?? {},
      timeseries_callouts: data.statistics,
      timeseries: data.timeseries,
      highlights: data.highlight,
      analytics: {
        data_as_of: data.table_summary.data_as_of,
        today: {
          resource_views: data.metrics_stats.data.today.resource_views.count,
          resource_downloads: data.metrics_stats.data.today.resource_downloads.count,
          ...data.table_summary.data.today,
        },
        last_month: {
          resource_views: data.metrics_stats.data.last_month.resource_views.count,
          resource_downloads: data.metrics_stats.data.last_month.resource_downloads.count,
          ...data.table_summary.data.last_month,
        },
        all_time: {
          resource_views: data.metrics_stats.data.all_time.resource_views.count,
          resource_downloads: data.metrics_stats.data.all_time.resource_downloads.count,
          ...data.table_summary.data.all_time,
        },
        total: {
          catalogue: data.total_catalog,
        },
      },
    },
  };
};

export default DashboardIndex;
