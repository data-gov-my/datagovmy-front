import Dashboard from "@dashboards/index";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const DashboardIndex: Page = ({
  analytics,
  sources,
  dashboards,
  query,
  dashboards_route,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboards", "agencies"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      <Dashboard
        queries={query}
        sources={sources}
        analytics={analytics}
        dashboards={dashboards}
        dashboards_route={dashboards_route}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboards",
  async ({ query }) => {
    try {
      const [dropdown, data] = await Promise.all([
        get("/dropdown", { dashboard: "dashboards" }).then(res => res.data),
        get("/dashboard", { dashboard: "dashboards" }).then(res => res.data),
      ]).catch(e => {
        throw new Error("Error retrieving dashboards data. Message: " + e);
      });

      return {
        props: {
          meta: {
            id: "dashboard-index",
            type: "misc",
            category: null,
            agency: null,
          },
          query: query,
          agency: null,
          sources: dropdown.data,
          analytics: {
            data_as_of: data.dashboards_top.data_as_of,
            today: data.dashboards_top.data.today,
            all_time: data.dashboards_top.data.all_time,
          },
          dashboards: data.dashboards_all.data,
          dashboards_route: data.dashboards_route.data,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 600, // 10 min
  }
);

export default DashboardIndex;
