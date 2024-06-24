import CarPopularityDashboard from "@dashboards/transportation/car-popularity";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { slugify } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CarPopularity: Page = ({
  last_updated,
  next_update,
  cars,
  meta,
  timeseries,
  tableData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboards");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("dashboards.car-popularity.name")}
        description={t("dashboards.car-popularity.description")}
      />
      <CarPopularityDashboard
        last_updated={last_updated}
        next_update={next_update}
        cars={cars}
        timeseries={timeseries}
        tableData={tableData}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-car-popularity", async ({}) => {
  try {
    const makers = ["Perodua", "Proton", "Honda"];
    const maker_id = makers.map(maker => `maker_id=${maker}`).join("&");
    const models = ["Myvi", "Saga", "City"];
    const model_id = models.map(model => `model_id=${model}`).join("&");

    const results = await Promise.allSettled([
      get("/dashboard", { dashboard: "car_popularity" }),
      get(`/explorer?explorer=car_popularity&${maker_id}&${model_id}`),
    ]);

    const [data, explorer] = results.map(e => {
      if (e.status === "rejected") return {};
      else return e.value.data;
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
        next_update: data.data_next_update,
        cars: makers.map((maker, i) => {
          const label = `${maker} ${models[i]}`;
          return {
            label,
            value: slugify(label),
            maker,
            model: models[i],
          };
        }),
        tableData: data,
        timeseries: explorer.timeseries,
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
