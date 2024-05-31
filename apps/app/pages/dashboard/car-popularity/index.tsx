import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { withi18n } from "datagovmy-ui/decorators";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CarPopularityDashboard from "@dashboards/transportation/car-popularity";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { slugify } from "datagovmy-ui/helpers";

const CarPopularity: Page = ({
  last_updated,
  next_update,
  cars,
  meta,
  timeseries,
  tableData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboard-car-popularity", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-car-popularity",
  async ({}) => {
    try {
      const makers = ["PERODUA", "PROTON", "HONDA"];
      const maker_id = makers.map(maker => `maker_id=${maker}`).join("&");
      const models = ["MYVI", "SAGA", "CITY"];
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
  }
);

export default CarPopularity;
