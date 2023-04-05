import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import OrganDonationDashboard from "@dashboards/healthcare/organ-donation";

const OrganDonation: Page = ({
  last_updated,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-organ-donation"]);

  return (
    <>
      <Metadata
        title={t("dashboard-organ-donation:header")}
        description={t("dashboard-organ-donation:description")}
        keywords={""}
      />
      <OrganDonationDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        choropleth={choropleth}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
      />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-organ-donation"]);
  const { data } = await get("/dashboard", { dashboard: "organ_donation", state: "mys" });

  return {
    notFound: false,
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      choropleth: data.choropleth_malaysia,
      barchart_age: data.barchart_age,
      barchart_time: data.barchart_time,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default OrganDonation;
