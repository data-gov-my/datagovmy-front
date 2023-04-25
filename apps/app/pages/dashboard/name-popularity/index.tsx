import Metadata from "@components/Metadata";
import NamePopularityDashboard from "@dashboards/demography/name-popularity";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetServerSidePropsType } from "next";

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

export const getStaticProps: GetStaticProps = withi18n("dashboard-name-popularity", async () => {
  return {
    props: {},
  };
});

export default NamePopularity;
