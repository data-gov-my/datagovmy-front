import Metadata from "@components/Metadata";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NamePopularityDashboard from "@dashboards/name-popularity";

const NamePopularity = ({ data }: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-name-popularity"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.name_popularity")}
        description={t("dashboard-name-popularity:description")}
        keywords={""}
      />
      <NamePopularityDashboard data={data} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-name-popularity"]);

  const { data } = await get("/explorer", {
    explorer: "name_dashboard",
    type: "first",
    name: "roshen",
  });

  return {
    props: {
      ...i18n,
      data: data,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default NamePopularity;
