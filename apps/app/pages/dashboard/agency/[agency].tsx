import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import Dashboard from "@dashboards/index";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";

const DashboardAgency: Page = ({
  analytics,
  sources,
  dashboards,
  agency,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      <Dashboard agency={agency} sources={sources} analytics={analytics} dashboards={dashboards} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(null, async ({ params }) => {
  try {
    const { data } = await get("/dashboard/", { dashboard: "dashboards" });
    return {
      props: {
        meta: {
          id: "dashboard-agency",
          type: "misc",
          category: null,
          agency: (params?.agency as string) || null,
        },
        agency: params?.agency || null,
        sources: data.agencies_all.data,
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
        dashboards: data.dashboards_all.data,
      },
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
});

export default DashboardAgency;
