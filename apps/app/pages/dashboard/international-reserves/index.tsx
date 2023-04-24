import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import InternationalReservesDashboard from "@dashboards/financial-sector/international-reserves";

const InternationalReserves: Page = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-international-reserves", "common"]);

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.international_reserves")}
        description={t("dashboard-international-reserves:description")}
        keywords={""}
      />
      <InternationalReservesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, [
    "common",
    "dashboard-international-reserves",
  ]);

  const { data } = await get("/dashboard", { dashboard: "international_reserves" });

  return {
    notFound: false,
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default InternationalReserves;
