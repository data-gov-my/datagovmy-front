import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
// import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import OrangAsliDashboard from "@dashboards/demography/orang-asli";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const OrangAsli: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-orang-asli", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("dashboard-orang-asli:header")}
        description={t("dashboard-orang-asli:description")}
        keywords={""}
      />
      <OrangAsliDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-orang-asli", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "orang-asli" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-orang-asli",
        type: "dashboard",
        category: "demography",
        agency: "JAKOA",
      },
    },
  };
});

export default OrangAsli;
