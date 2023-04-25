import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PublicContractingDashboard from "@dashboards/public-finances/public-contracting";
import { withi18n } from "@lib/decorators";

const PublicContracting: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-public-contracting"]);

  return (
    <>
      <Metadata
        title={t("dashboard-public-contracting:header")}
        description={t("dashboard-public-contracting:description")}
        keywords={""}
      />
      <PublicContractingDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-public-contracting", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default PublicContracting;
