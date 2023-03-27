import Metadata from "@components/Metadata";
import BirthdayPopularityDashboard from "@dashboards/birthday-popularity";
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BirthdayPopularity = ({
  // query,
  // rank_overall,
  timeseries,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-birthday-popularity"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.birthday_popularity")}
        description={t("dashboard-birthday-popularity:description")}
        keywords={""}
      />
      {/* <BirthdayPopularityDashboard query={query} rank={rank_overall} timeseries={timeseries} /> */}
      {/* <BirthdayPopularityDashboard rank={rank_overall} timeseries={timeseries}/> */}
      <BirthdayPopularityDashboard timeseries={timeseries} />
    </>
  );
};

const isFutureDate = (date: Date) => {
  return new Date().getTime() - date.getTime() < 0;
};
const isInvalidDate = (date: Date) => {
  return isNaN(date.valueOf());
};

const formatDate = (inputDate: Date): string => {
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-birthday-popularity"]);
  const { data } = await get("/dashboard", {
    dashboard: "birthday_popularity",
    state: "mys",
    bday: "01-01",
  });
  return {
    props: {
      ...i18n,
      ...data,
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
//   const i18n = await serverSideTranslations(locale!, ["common", "dashboard-birthday-popularity"]);

//   const date = new Date(String(query.bday));
//   const bday: any = isFutureDate(date) && isInvalidDate(date) ? (query = {}) : formatDate(date);
//   const emptyQuery = Object.keys(query).length === 0;

//   const { data } = await get("/dashboard", {
//     dashboard: "birthday_popularity",
//     state: emptyQuery ? "mys" : query.state,
//     bday: emptyQuery ? "01-01" : bday,
//   });

//   return {
//     props: {
//       ...i18n,
//       ...data,
//       query,
//     },
//   };
// };

export default BirthdayPopularity;
