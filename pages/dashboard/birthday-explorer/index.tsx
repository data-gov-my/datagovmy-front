import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/birthday-explorer";
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BirthdayExplorer = ({
  // query,
  // rank_overall,
  timeseries,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-birthday-explorer"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.birthday_explorer")}
        description={t("dashboard-birthday-explorer:description")}
        keywords={""}
      />
      {/* <BirthdayExplorerDashboard query={query} rank={rank_overall} timeseries={timeseries} /> */}
      {/* <BirthdayExplorerDashboard rank={rank_overall} timeseries={timeseries}/> */}
      <BirthdayExplorerDashboard timeseries={timeseries} />
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

// export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
//   const i18n = await serverSideTranslations(locale!, ["common", "dashboard-birthday-explorer"]);

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

export default BirthdayExplorer;
