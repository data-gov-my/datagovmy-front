import { Metadata } from "datagovmy-ui/components";
import ImmigrationDashboard from "@dashboards/demography/immigration";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";

const Immigration: Page = ({
  meta,
  params,
  last_updated,
  countries,
  timeseries,
  timeseries_callout,
  demography,
  demography_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-immigration", "common", "countries"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ImmigrationDashboard
        countries={countries}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        demography={demography}
        demography_callout={demography_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-immigration", "countries"],
  async ({ params }) => {
    try {
      const country = params?.country ? params.country[0] : "ALL";

      const [{ data: dropdown }, { data }] = await Promise.all([
        get("/dropdown", { dashboard: "immigration_country" }),
        get("/dashboard", { dashboard: "immigration_temp", country }),
      ]).catch(e => {
        console.error(e);
        throw new Error("Invalid country. Message: " + e);
      });

      return {
        props: {
          meta: {
            id: "dashboard-immigration",
            type: "dashboard",
            category: "demography",
            agency: "imigresen",
          },
          params: {
            country: country || "ALL",
          },
          last_updated: data.data_last_updated,
          countries: dropdown,
          timeseries: data.timeseries_country,
          timeseries_callout: data.timeseries_country_callout,
          // TODO: to add back later when switch
          // demography: data.timeseries_demography,
          // demography_callout: data.timeseries_demography_callout,
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default Immigration;
