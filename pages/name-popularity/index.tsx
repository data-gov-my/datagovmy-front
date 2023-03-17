import Metadata from "@components/Metadata";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NamePopularityDashboard from "@dashboards/name-popularity";

const NamePopularity = ({
  name,
  total,
  decade,
  count,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-name-popularity"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.name_popularity")}
        description={t("dashboard-name-popularity:description")}
        keywords={""}
      />
      <NamePopularityDashboard name={name} total={total} decade={decade} count={count} />
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
      name: data.name,
      total: data.total,
      decade: data.decade,
      count: data.count,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
    revalidate: 1,
  };
};

export default NamePopularity;
