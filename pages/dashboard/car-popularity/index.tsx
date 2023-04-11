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
      model_1: [
        "all_colours",
        "colour_4",
        "colour_10",
        "colour_1",
        "colour_7",
        "colour_5",
        "colour_8",
        "colour_9",
        "colour_3",
        "colour_6",
        "colour_2",
      ],
      model_2: [
        "all_colours",
        "colour_4",
        "colour_10",
        "colour_1",
        "colour_7",
        "colour_5",
        "colour_8",
        "colour_9",
        "colour_3",
        "colour_6",
        "colour_2",
      ],
    },
    manufacturer_2: {
      model_1: [
        "all_colours",
        "colour_4",
        "colour_10",
        "colour_1",
        "colour_7",
        "colour_5",
        "colour_8",
        "colour_9",
        "colour_3",
        "colour_6",
        "colour_2",
      ],
      model_2: ["colour_2"],
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
