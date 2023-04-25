import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PublicTransportationDashboard from "@dashboards/transportation/public-transportation";
import { withi18n } from "@lib/decorators";

const PublicTransportation: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-public-transportation"]);

  return (
    <>
      <Metadata
        title={t("dashboard-public-transportation:header")}
        description={t("dashboard-public-transportation:description")}
        keywords={""}
      />
      <PublicTransportationDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-public-transportation",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {},
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default PublicTransportation;
