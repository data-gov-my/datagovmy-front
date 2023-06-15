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
  const { t } = useTranslation(["dashboards", "agencies"]);

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

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboards", "agencies"],
  async ({ params }) => {
    try {
      const [agencyDropdown, data] = await Promise.all([
        get("/dropdown", { dashboard: "dashboards" }).then(res => {
          if (!res.data?.data.find((agency: string) => agency === params?.agency)) {
            throw `Invalid agency parameter: ${params?.agency}`;
          }
          return res.data;
        }),
        get("/dashboard", { dashboard: "dashboards" }).then(res => res.data),
      ]).catch(e => {
        throw new Error("Error retrieving dashboards data. Message: " + e);
      });

      return {
        props: {
          meta: {
            id: "dashboard-agency",
            type: "misc",
            category: null,
            agency: (params?.agency as string) || null,
          },
          agency: params?.agency || null,
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
    } catch (error) {
      console.log(error);
      return { notFound: true };
    }
  }
);

export default DashboardAgency;
