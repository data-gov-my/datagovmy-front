import Dashboard from "@dashboards/index";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const DashboardAgency: Page = ({
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

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboards", "agencies"],
  async ({ params }) => {
    try {
      const _agency = params ? String(params?.agency).toLowerCase() : null;
      const [agencyDropdown, data] = await Promise.all([
        get("/dropdown", { dashboard: "dashboards" }).then(res => {
          if (!res.data?.data.find((agency: string) => agency === _agency)) {
            throw `Invalid agency parameter: ${_agency}`;
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
            agency: _agency,
          },
          agency: _agency,
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
    } catch (e) {
      console.error(e);
      return { notFound: true };
    }
  }
);

export default DashboardAgency;
