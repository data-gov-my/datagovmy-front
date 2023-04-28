import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PeoplesIncomeInitiativeDashboard from "@dashboards/government/peoples-income-initiative";
import { withi18n } from "@lib/decorators";

const PeoplesIncomeInitiative: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peoples-income-initiative", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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
    };
  }
);

export default PeoplesIncomeInitiative;
