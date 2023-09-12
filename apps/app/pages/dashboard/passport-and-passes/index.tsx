import { Metadata } from "datagovmy-ui/components";
import PassportAndPassesDashboard from "@dashboards/demography/passport-and-passes";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";

/**
 * Passport and Passes Dashboard
 * @overview Status: In-development. Slated for future release.
 */

const Immigration: Page = ({
  meta,
  choropleth,
  last_updated,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-passport-and-passes", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PassportAndPassesDashboard
        choropleth={choropleth}
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-passport-and-passes",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "immigration" });

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: "dashboard-passport-and-passes",
          type: "dashboard",
          category: "public-administration",
          agency: "imigresen",
        },
        last_updated: data.data_last_updated,
        choropleth: data.choropleth,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default Immigration;
