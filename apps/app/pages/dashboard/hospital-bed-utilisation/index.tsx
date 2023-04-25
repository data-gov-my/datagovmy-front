import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import HospitalBedUtilisationDashboard from "@dashboards/healthcare/hospital-bed-utilisation";
import { withi18n } from "@lib/decorators";

const HospitalBedUtilisation: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-hospital-bed-utilisation"]);

  return (
    <>
      <Metadata
        title={t("dashboard-hospital-bed-utilisation:header")}
        description={t("dashboard-hospital-bed-utilisation:description")}
        keywords={""}
      />
      <HospitalBedUtilisationDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-hospital-bed-utilisation",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {},
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default HospitalBedUtilisation;
