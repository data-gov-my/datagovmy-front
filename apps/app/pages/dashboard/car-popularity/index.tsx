import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { withi18n } from "@lib/decorators";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CarPopularityDashboard from "@dashboards/transportation/car-popularity";

const CarPopularity: Page = ({ queryOptions }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-car-popularity", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CarPopularityDashboard queryOptions={queryOptions} />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-car-popularity", async () => {
  const { data } = await get("/dropdown", { dashboard: "car_popularity" });
  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-car-popularity",
        type: "dashboard",
        category: "transportation",
        agency: "JPJ",
      },
      queryOptions: data,
    },
  };
});

export default CarPopularity;
