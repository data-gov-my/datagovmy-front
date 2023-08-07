import { Metadata } from "datagovmy-ui/components";
import NamePopularityDashboard from "@dashboards/demography/name-popularity";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const NamePopularity: Page = ({
  meta,
  top_names,
  yearDropdown,
  ethnicityDropdown,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-name-popularity", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <NamePopularityDashboard
        top_names={top_names}
        yearDropdown={yearDropdown}
        ethnicityDropdown={ethnicityDropdown}
      />
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
      yearDropdown: data.year_dropdown.data.data,
      ethnicityDropdown: data.ethnicity_dropdown.data.data,
    },
  };
});

export default NamePopularity;
