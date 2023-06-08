import Metadata from "@components/Metadata";
import RubberDashboard from "@dashboards/rubber";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Rubber = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.rubber")}
        description={t("rubber.description")}
        keywords={""}
      />
      <RubberDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    notFound: true,
  };
  /** Page disabled until further notice */
  //   const i18n = await serverSideTranslations(locale!, ["common"]);

  //   const { data } = await get("/dashboard", { dashboard: "rubber" });

  //   return {
  //     props: {
  //       ...i18n,
  //       last_updated: new Date().valueOf(),
  //       timeseries: data.timeseries,
  //       timeseries_callouts: data.statistics,
  //     },
  //   };
};

export default Rubber;
