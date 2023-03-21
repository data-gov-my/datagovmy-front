import Metadata from "@components/Metadata";
import BirthdayPopularityDashboard from "@dashboards/birthday-popularity";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BirthdayPopularity = ({
  query,
  rank_overall,
  timeseries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["common", "dashboard-birthday-popularity"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.birthday_popularity")}
        description={t("dashboard-birthday-popularity:description")}
        keywords={""}
      />
      <BirthdayPopularityDashboard query={query} rank={rank_overall} timeseries={timeseries} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-birthday-popularity"]);
  const emptyQuery = Object.keys(query).length === 0;
  const str: any = query.bday!;
  const { data } = await get("/dashboard", {
    dashboard: "birthday_popularity",
    state: emptyQuery ? "mys" : query.state,
    bday: emptyQuery ? "01-01" : str.substring(str.length - 5),
  });

  return {
    props: {
      ...i18n,
      ...data,
      query,
    },
  };
};

export default BirthdayPopularity;
