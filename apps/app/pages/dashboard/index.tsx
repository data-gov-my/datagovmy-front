import Dashboard from "@dashboards/index";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const DashboardIndex: Page = ({
  dropdown,
  dashboards,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "agencies"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={t("description")} keywords={""} />
      <Dashboard dropdown={dropdown} dashboards={dashboards} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(["dashboards"], async () => {
  try {
    const [dropdown, data] = await Promise.all([
      get("/dropdown", { dashboard: "dashboards" }).then(res => res.data),
      get("/dashboard", { dashboard: "dashboards2", site: "datagovmy" }).then(res => res.data),
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
        dropdown: dropdown.data,
        dashboards: data.dashboards,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
});

export default DashboardIndex;
