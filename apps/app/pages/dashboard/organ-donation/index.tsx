import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import OrganDonationDashboard from "@dashboards/healthcare/organ-donation";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { DateTime } from "luxon";

const OrganDonation: Page = ({
  last_updated,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-organ-donation", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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

OrganDonation.layout = page => (
  <Layout
    className={[Fonts.body.variable, "font-sans"].join(" ")}
    stateSelector={<StateDropdown url={routes.ORGAN_DONATION} currentState={"mys"} hideOnScroll />}
  >
    <StateModal url={routes.ORGAN_DONATION} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-organ-donation", "common"]);
  const { data } = await get("/dashboard", { dashboard: "organ_donation", state: "mys" });

  // transform:
  data.barchart_time.data.monthly.x = data.barchart_time.data.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

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
