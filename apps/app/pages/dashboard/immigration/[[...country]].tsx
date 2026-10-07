import { Metadata } from "datagovmy-ui/components";
import ImmigrationDashboard, { ImmigrationProps } from "@dashboards/demography/immigration";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import {
  CONTINENTS,
  ImmigrationData,
  topCountries,
} from "@dashboards/demography/immigration/types";
import { routes } from "@lib/routes";

const IMMIGRATION_DATA = "https://storage.data.gov.my/dashboards/immigration.json";

const Immigration: Page = ({ meta, ...props }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-immigration", "common", "countries"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ImmigrationDashboard {...(props as ImmigrationProps)} />
    </AnalyticsProvider>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

/**
 * Everything comes from one static JSON built by the arrivals pipeline (dataproc-jim), so the
 * build no longer depends on the backend API.
 *
 * The dashboard is one page, with the country in the query string:
 *
 *   /dashboard/immigration?country=SG
 *
 * Every country's series ships with the page (~170 KB, ~60 KB gzipped), so switching country is
 * instant and needs no server round trip. The country used to be a path segment
 * (/dashboard/immigration/SG); those links still exist, so this catch-all route stays to answer
 * them with a permanent redirect to the query form.
 */
export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-immigration", "countries"],
  async ({ params, locale, defaultLocale }) => {
    const response = await fetch(IMMIGRATION_DATA);
    if (!response.ok) {
      throw new Error(`Immigration data fetch failed: ${response.status}`);
    }
    const data: ImmigrationData = await response.json();

    // Old-style link: /dashboard/immigration/{country}
    const segments = (params?.country as string[] | undefined) ?? [];
    if (segments.length) {
      const country = segments[0].toUpperCase();
      // An unknown code falls through to the national view rather than an empty chart
      const query = country !== "ALL" && data.timeseries[country] ? `?country=${country}` : "";
      // A redirect from getStaticProps is not locale-aware: the destination is taken literally
      const prefix = locale && locale !== defaultLocale ? `/${locale}` : "";
      return {
        redirect: { destination: `${prefix}${routes.IMMIGRATION}${query}`, permanent: true },
      };
    }

    const x = data.x.map(date => Date.parse(date));

    return {
      props: {
        meta: {
          id: "dashboard-immigration",
          type: "dashboard",
          category: "demography",
          agency: "imigresen",
        },
        last_updated: data.data_last_updated,
        next_update: data.data_next_update,
        data_as_of: data.data_as_of,
        // Busiest sources first, so the dropdown opens on the countries people look for
        countries: Object.keys(data.timeseries).sort((a, b) =>
          a === "ALL" ? -1 : b === "ALL" ? 1 : sumLast(data, b) - sumLast(data, a)
        ),
        top_countries: topCountries(data),
        x,
        timeseries: data.timeseries,
        continents: {
          x,
          ...Object.fromEntries(CONTINENTS.map(c => [c, data.continents[c]])),
        },
        key_sources: {
          start: data.key_sources.start,
          end: data.key_sources.end,
          countries: data.key_sources.countries,
          timeseries: {
            x,
            ...Object.fromEntries(
              data.key_sources.countries.map(c => [c, data.timeseries[c].total])
            ),
          },
        },
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

const sumLast = (data: ImmigrationData, country: string, months = 12) =>
  data.timeseries[country].total.slice(-months).reduce((a, b) => a + b, 0);

export default Immigration;
