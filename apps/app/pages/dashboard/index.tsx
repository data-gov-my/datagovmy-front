import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import Dashboard from "@dashboards/index";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";

const DashboardIndex: Page = ({
  analytics,
  sources,
  dashboards,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      <Dashboard query={query} sources={sources} analytics={analytics} dashboards={dashboards} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(null, async ({ query }) => {
  const { data } = await get("/dashboard/", { dashboard: "dashboards" });

  return {
    props: {
      query: query ?? {},
      data: data,
      sources: data.agencies_all.data,
      timeseries: [],
      analytics: {
        data_as_of: data.dashboards_top.data_as_of,
        en: {
          today: data.dashboards_top.data.en.today,
          last_month: data.dashboards_top.data.en.last_month,
          all_time: data.dashboards_top.data.en.all_time,
        },
        bm: {
          today: data.dashboards_top.data.bm.today,
          last_month: data.dashboards_top.data.bm.last_month,
          all_time: data.dashboards_top.data.bm.all_time,
        },
      },
      data_as_of: data.dashboards_all.data_as_of,
      dashboards: data.dashboards_all.data,
    },
  };
});

export default DashboardIndex;
