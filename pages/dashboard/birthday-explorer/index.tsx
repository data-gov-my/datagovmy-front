import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/birthday-explorer";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BirthdayExplorer = ({ timeseries }: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-birthday-explorer"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.birthday_explorer")}
        description={t("dashboard-birthday-explorer:description")}
        keywords={""}
      />
      <BirthdayExplorerDashboard timeseries={timeseries} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-birthday-explorer"]);
  const { data } = await get("/dashboard", {
    dashboard: "birthday_popularity",
    state: "mys",
  });
  return {
    props: {
      ...i18n,
      ...data,
    },
  };
};

export default BirthdayExplorer;
