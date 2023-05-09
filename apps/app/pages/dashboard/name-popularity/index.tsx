import Metadata from "@components/Metadata";
import NamePopularityDashboard from "@dashboards/demography/name-popularity";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const NamePopularity: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-name-popularity", "common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.name_popularity")}
        description={t("description")}
        keywords={""}
      />
      <NamePopularityDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-name-popularity", async () => {
  return {
    props: {
      meta: {
        id: "dashboard-name-popularity",
        type: "dashboard",
        category: "demography",
        agency: "JPN",
      },
    },
  };
});

export default NamePopularity;
