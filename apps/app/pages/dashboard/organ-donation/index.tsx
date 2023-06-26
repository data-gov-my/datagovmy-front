import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import Fonts from "@config/font";
import OrganDonationDashboard from "@dashboards/healthcare/organ-donation";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import type { Page } from "@lib/types";
import { DateTime } from "luxon";
import { withi18n } from "@lib/decorators";
import { clx } from "@lib/helpers";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const OrganDonation: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-organ-donation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <OrganDonationDashboard
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        choropleth={choropleth}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
      />
    </AnalyticsProvider>
  );
};

OrganDonation.layout = (page, props) => (
  <Layout
    className={clx(Fonts.body.variable, "font-sans")}
    stateSelector={
      <StateDropdown url={routes.ORGAN_DONATION} currentState={props.params.state} hideOnScroll />
    }
  >
    <StateModal state={props.params.state} url={routes.ORGAN_DONATION} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-organ-donation", async () => {
  const { data } = await get("/dashboard", { dashboard: "organ_donation", state: "mys" });

  // transform:
  data.barchart_time.data.monthly.x = data.barchart_time.data.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-organ-donation",
        type: "dashboard",
        category: "healthcare",
        agency: "NTRC",
      },
      last_updated: data.data_last_updated,
      params: { state: "mys" },
      timeseries: data.timeseries,
      choropleth: data.choropleth_malaysia,
      barchart_age: data.barchart_age,
      barchart_time: data.barchart_time,
    },
  };
});

export default OrganDonation;
