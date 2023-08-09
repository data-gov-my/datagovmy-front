import Progress from "@components/Progress";
import Dashboard from "@dashboards/index";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const DashboardIndex: Page = ({
  analytics,
  sources,
  dashboards,
  agency,
  dashboards_route,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "agencies"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      {/* <Progress /> */}
      <Dashboard
        agency={agency}
        sources={sources}
        analytics={analytics}
        dashboards={dashboards}
        dashboards_route={dashboards_route}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(["dashboards", "agencies"], async () => {
  const [agencyDropdown, data] = await Promise.all([
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
      agency: null,
      sources: agencyDropdown.data,
      analytics: {
        data_as_of: data.dashboards_top.data_as_of,
        today: data.dashboards_top.data.today,
        last_month: data.dashboards_top.data.last_month,
        all_time: data.dashboards_top.data.all_time,
      },
      dashboards: data.dashboards_all.data,
      dashboards_route: data.dashboards_route.data,
    },
  };
});

export default DashboardIndex;
