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
    const [dropdown, chart, tableData] = await Promise.all([
      get("/dropdown", {
        dashboard: "car_popularity",
      }),
      get("/chart", {
        dashboard: "car_popularity",
        chart_name: "timeseries",
        manufacturer: "PROTON",
        model: "WIRA",
        colour: "All",
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
        last_updated: chart.data.data_last_updated,
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
