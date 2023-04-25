import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PeoplesIncomeInitiativeDashboard from "@dashboards/government/peoples-income-initiative";
import { withi18n } from "@lib/decorators";

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
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-peoples-income-initiative",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {},
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default PeoplesIncomeInitiative;
