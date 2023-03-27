import Metadata from "@components/Metadata";
import NamePopularityDashboard from "@dashboards/demography/name-popularity";
import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NamePopularity: Page = ({}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-name-popularity"]);

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.name_popularity")}
        description={t("dashboard-name-popularity:description")}
        keywords={""}
      />
      <NamePopularityDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-name-popularity"]);
  return {
    props: {
      ...i18n,
    },
  };
};

export default NamePopularity;
