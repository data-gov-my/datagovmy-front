import Metadata from "@components/Metadata";
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NamePopularityDashboard from "@dashboards/name-popularity";

const NamePopularity = ({
  name,
  total,
  type,
  decade,
  count,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["common", "dashboard-name-popularity"]);
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.name_popularity")}
        description={t("dashboard-name-popularity:description")}
        keywords={""}
      />
      <NamePopularityDashboard
        query={query}
        name={name}
        type={type}
        total={total}
        decade={decade}
        count={count}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-name-popularity"]);

  const emptyQuery = Object.keys(query).length === 0;

  // FIXME: fix behaviour if no query on initial render
  const { data } = await get("/explorer", {
    explorer: "NAME_POPULARITY",
    type: emptyQuery ? "last" : query.type,
    name: emptyQuery ? "lim" : query.name,
  });

  return {
    props: {
      ...i18n,
      query: query ?? {},
      ...data,
      type: emptyQuery ? "last" : query.type,
    },
  };
};

export default NamePopularity;
