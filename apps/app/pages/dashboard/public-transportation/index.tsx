import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PublicTransportationDashboard from "@dashboards/transportation/public-transportation";
import { withi18n } from "@lib/decorators";

const PublicTransportation: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-public-transportation", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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
    };
  }
);

export default PublicTransportation;
