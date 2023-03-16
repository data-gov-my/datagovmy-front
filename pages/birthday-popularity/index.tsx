import Metadata from "@components/Metadata";
import BirthdayPopularityDashboard from "@dashboards/birthday-popularity";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BirthdayPopularity = (
  {
    // bar,
  }
) => {
  const { t } = useTranslation(["common", "dashboard-birthday-popularity"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.birthday_popularity")}
        description={t("dashboard-birthday-popularity:description")}
        keywords={""}
      />
      <BirthdayPopularityDashboard
      // bar={bar}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-birthday-popularity"]);

  // const { data } = await get("/dashboard", { dashboard: "birthday-popularity" });

  return {
    props: {
      ...i18n,
      // bar: data.bar_chart,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default BirthdayPopularity;
