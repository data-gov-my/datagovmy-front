import { Metadata } from "datagovmy-ui/components";
import ImmigrationDashboard from "@dashboards/demography/immigration";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";

const Immigration: Page = ({
  meta,
  choropleth,
  countries,
  country,
  country_callout,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-immigration", "common", "countries"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ImmigrationDashboard
        choropleth={choropleth}
        countries={countries}
        country={country}
        country_callout={country_callout}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-immigration", "countries"],
  async () => {
    try {
      const country = "overall";
      const [{ data: dropdown }, { data }, { data: country_data }] = await Promise.all([
        get("/dropdown", { dashboard: "immigration_country" }),
        get("/dashboard", {
          dashboard: "immigration",
        }),
        get("/dashboard", {
          dashboard: "immigration_country",
          country,
        }),
      ]).catch(e => {
        throw new Error("Invalid country. Message: " + e);
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "dashboard-immigration",
            type: "dashboard",
            category: "demography",
            agency: "Imigresen",
          },
          choropleth: data.choropleth,
          countries: dropdown.data,
          country: country_data.timeseries_country,
          country_callout: country_data.timeseries_country_callout.data,
          last_updated: data.data_last_updated,
          params: {},
          timeseries: data.timeseries,
          timeseries_callout: data.timeseries_callout.data.data,
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default Immigration;
