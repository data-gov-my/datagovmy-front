import Dashboard from "@dashboards/index";
import { routes } from "@lib/routes";
import { get } from "datagovmy-ui/api";
import { Metadata, Progress } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const DashboardIndex: Page = ({ dashboards }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.dashboards")}
        description={t("description", { agency: t("agencies:dosm.abbr"), context: "agency" })}
        keywords={""}
      />
      <Progress />
      <Dashboard dashboards={dashboards} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboards", "opendosm-home"],
  async () => {
    try {
      const { data } = await get("/dashboard", { dashboard: "dashboards2", site: "opendosm" });

      return {
        props: {
          meta: {
            id: "dashboard-index",
            type: "misc",
            category: null,
            agency: null,
          },
          dashboards: data.dashboards,
        },
      };
    } catch (error) {
      return { notFound: true };
    }
  }
);

export default DashboardIndex;
