import Metadata from "@components/Metadata";
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NamePopularityDashboard from "@dashboards/name-popularity";
import { Page } from "@lib/types";

const NamePopularity: Page = ({}: // query,
// data,
InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-name-popularity"]);

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.name_popularity")}
        description={t("dashboard-name-popularity:description")}
        keywords={""}
      />
      {/* <NamePopularityDashboard query={query} data={data} /> */}
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

// export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
//   const i18n = await serverSideTranslations(locale!, ["common", "dashboard-name-popularity"]);

//   const emptyQuery = Object.keys(query).length === 0;

//   const params = {
//     explorer: "NAME_POPULARITY",
//     type: emptyQuery ? "first" : query.type,
//     name: emptyQuery ? "" : query.name,
//     compare_name: emptyQuery ? "false" : query.compare_name,
//   };

//   // FIXME: fix behaviour if no query on initial render
//   let { data } = await get("/explorer", params);

//   return {
//     props: {
//       ...i18n,
//       query: query ?? {},
//       data: data,
//     },
//   };
// };

export default NamePopularity;
