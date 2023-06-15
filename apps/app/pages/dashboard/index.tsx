import { GetStaticProps, InferGetStaticPropsType } from "next";
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
  agency,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "agencies"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      <Dashboard agency={agency} sources={sources} analytics={analytics} dashboards={dashboards} />
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
    },
  };
});

export default DashboardIndex;
