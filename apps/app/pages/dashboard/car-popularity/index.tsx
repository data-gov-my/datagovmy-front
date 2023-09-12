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
  last_updated,
  meta,
  model,
  queryOptions,
  tableData,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-car-popularity", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CarPopularityDashboard
        last_updated={last_updated}
        model={model}
        queryOptions={queryOptions}
        tableData={tableData}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-car-popularity", async () => {
  try {
    const [{ data: dropdown }, { data }, { data: model }] = await Promise.all([
      get("/dropdown", {
        dashboard: "car_popularity",
      }),
      get("/dashboard", { dashboard: "car_popularity" }),
      get("chart/", {
        dashboard: "car_popularity",
        chart_name: "timeseries",
        maker: "PERODUA",
        model: "MYVI",
      }),
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
        last_updated: data.data_last_updated,
        model: model,
        queryOptions: dropdown.data,
        tableData: data,
        timeseries: data.vehicle_timeseries,
        timeseries_callout: data.vehicle_timeseries_callout,
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
