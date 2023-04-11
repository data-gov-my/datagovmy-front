import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-car-popularity"], null, [
    "en-GB",
    "ms-MY",
  ]);
  // const { data } = await get("/dashboard", { dashboard: "" });

  const data = {
    manufacturer_1: {
      manufacturer_1_model_1: ["1-1-colours", "1-1-red", "1-1-blue"],
      manufacturer_1_model_2: ["1-2-red", "1-2-green"],
    },
    manufacturer_2: {
      m2_model_1: ["2-2-1-purple", "2-2-1-red", "2-2-1-pink"],
      m2_model_2: ["2-2-last-color", "2-2-last-pink"],
      m2_model_3: ["2-3-last-color", "2-3-last-pink"],
    },
  };

  return {
    notFound: false,
    props: {
      ...i18n,
      queryOptions: data,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default CarPopularity;
