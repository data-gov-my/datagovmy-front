import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CivilServiceDashboard from "@dashboards/public-finances/civil-service";
import { withi18n } from "@lib/decorators";

const CivilService: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CivilServiceDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-civil-service", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-civil-service",
        type: "dashboard",
        category: "public-finances",
        agency: "JPA",
      },
    },
  };
});

export default CivilService;
