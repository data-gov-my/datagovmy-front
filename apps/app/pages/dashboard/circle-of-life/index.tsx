import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CircleofLifeDashboard from "@dashboards/demography/circle-of-life";

const CircleofLife: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-circle-of-life", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CircleofLifeDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-circle-of-life", "common"]);
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      ...i18n,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default CircleofLife;
