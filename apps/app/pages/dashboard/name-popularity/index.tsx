import Metadata from "@components/Metadata";
import NamePopularityDashboard from "@dashboards/demography/name-popularity";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const NamePopularity: Page = ({
  meta,
  top_names,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-name-popularity", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <NamePopularityDashboard top_names={top_names} />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-name-popularity", async () => {
  const { data } = await get("/dashboard", { dashboard: "name_popularity" }).catch(e => {
    throw new Error("Name Popularity data was not fetched properly. " + e);
  });

  return {
    notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
    props: {
      meta: {
        id: "dashboard-name-popularity",
        type: "dashboard",
        category: "demography",
        agency: "JPN",
      },
      top_names: data.top_names.data,
    },
  };
});

export default NamePopularity;
