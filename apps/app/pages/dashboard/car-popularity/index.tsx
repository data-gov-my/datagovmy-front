import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { withi18n } from "datagovmy-ui/decorators";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CarPopularityDashboard from "@dashboards/transportation/car-popularity";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const CarPopularity: Page = ({
  meta,
  last_updated,
  queryOptions,
  tableData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-car-popularity", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CarPopularityDashboard
        last_updated={last_updated}
        queryOptions={queryOptions}
        tableData={tableData}
      />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-car-popularity", async () => {
  try {
    const [dropdown, tableData] = await Promise.all([
      get("/dropdown", {
        dashboard: "car_popularity",
      }),
      get("/dashboard", { dashboard: "car_popularity" }),
    ]).catch(e => {
      throw new Error("Error: " + e);
    });
    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-car-popularity",
          type: "dashboard",
          category: "transportation",
          agency: "JPJ",
        },
        queryOptions: dropdown.data.data,
        last_updated: tableData.data.data_last_updated,
        tableData: tableData.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
});

export default CarPopularity;
