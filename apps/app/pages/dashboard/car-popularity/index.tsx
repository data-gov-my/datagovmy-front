import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { withi18n } from "@lib/decorators";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CarPopularityDashboard from "@dashboards/transportation/car-popularity";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const CarPopularity: Page = ({
  meta,
  queryOptions,
  tableData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-car-popularity", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CarPopularityDashboard queryOptions={queryOptions} tableData={tableData} />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-car-popularity", async () => {
  const { data: dropdownData } = await get("/dropdown", { dashboard: "car_popularity" });
  const { data: tableData } = await get("/dashboard", { dashboard: "car_popularity" });
  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-car-popularity",
        type: "dashboard",
        category: "transportation",
        agency: "JPJ",
      },
      queryOptions: dropdownData.data,
      tableData: tableData,
    },
  };
});

export default CarPopularity;
