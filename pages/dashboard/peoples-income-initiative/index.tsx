import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PeoplesIncomeInitiativeDashboard from "@dashboards/government/peoples-income-initiative";

const PeoplesIncomeInitiative: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-peoples-income-initiative"]);

  return (
    <>
      <Metadata
        title={t("dashboard-peoples-income-initiative:header")}
        description={t("dashboard-peoples-income-initiative:description")}
        keywords={""}
      />
      <PeoplesIncomeInitiativeDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(
    locale!,
    ["common", "dashboard-peoples-income-initiative"],
    null,
    ["en-GB", "ms-MY"]
  );
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      ...i18n,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default PeoplesIncomeInitiative;
