import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CircleofLifeDashboard from "@dashboards/demography/circle-of-life";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const CircleofLife: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-circle-of-life", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CircleofLifeDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-circle-of-life", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-circle-of-life",
        type: "dashboard",
        category: "demography",
        agency: "JPN",
      },
    },
  };
});

export default CircleofLife;
