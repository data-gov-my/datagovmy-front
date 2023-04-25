import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { withi18n } from "@lib/decorators";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CarPopularityDashboard from "@dashboards/transportation/car-popularity";

const CarPopularity: Page = ({ queryOptions }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-car-popularity"]);

  return (
    <>
      <Metadata
        title={t("dashboard-car-popularity:header")}
        description={t("dashboard-car-popularity:description")}
        keywords={""}
      />
      <CarPopularityDashboard queryOptions={queryOptions} />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-car-popularity",
  async ({ locale }) => {
    const { data } = await get("/dropdown", { dashboard: "car_popularity" });
    return {
      notFound: false,
      props: {
        queryOptions: data.query_values.data.data,
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default CarPopularity;
