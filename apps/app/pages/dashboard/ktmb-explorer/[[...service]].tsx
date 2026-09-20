import Layout from "@components/Layout";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { Metadata } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { routes } from "@lib/routes";
import { serviceSlug, stationSlug } from "@dashboards/transportation/ktmb-explorer/slug";

const EXPLORER_META = "https://storage.data.gov.my/dashboards/ktmb_explorer_meta.json";
const KTMB_EXPLORER = routes.KTMB_EXPLORER;

const KTMBExplorer: Page = ({ meta, explorer }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-ktmb-explorer");

  return (
    <AnalyticsProvider meta={meta}>
      <Head>
        {/*
          DuckDB, its parquet extension and the data all live on this one
          origin, and are fetched the moment DuckDB starts warming. Opening the
          connection during the initial render means the warm-up does not also
          pay for DNS and TLS.
        */}
        <link rel="preconnect" href="https://storage.data.gov.my" crossOrigin="anonymous" />
      </Head>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <KTMBExplorerDashboard explorer={explorer} />
    </AnalyticsProvider>
  );
};

KTMBExplorer.layout = (page, props) => {
  return <Layout className={clx(body.variable, "font-sans")}>{page}</Layout>;
};

/**
 * The explorer lives at one URL, with the selection in the query string:
 *
 *   /dashboard/ktmb-explorer?service=komuter&origin=all-stations&destination=kl-sentral
 *
 * It used to be a catch-all path of raw station labels, which encoded into
 * `/tebrau/JB%20Sentral/Woodlands%20CIQ` -- unreadable, and unpleasant to paste
 * anywhere. Those links are still out in the world, so this route stays to
 * catch them and answers with a permanent redirect to the slug form.
 *
 * Only the bare path is rendered. There is one page, statically generated, and
 * the query decides nothing on the server: props are identical for every pair,
 * and the browser resolves the slugs and queries DuckDB for that pair itself.
 */
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-ktmb-explorer",
  async ({ params, locale, defaultLocale }) => {
    const response = await fetch(EXPLORER_META);
    if (!response.ok) {
      throw new Error(`KTMB explorer metadata fetch failed: ${response.status}`);
    }
    const explorer = await response.json();

    // Old-style link: /{service}/{origin}/{destination}, labels and all.
    const segments = (params?.service as string[] | undefined) ?? [];
    if (segments.length) {
      const [service, origin, destination] = segments.map(segment => {
        try {
          return decodeURIComponent(segment);
        } catch {
          return segment;
        }
      });

      const known: string[] = explorer.services ?? [];
      const resolved = known.find(s => s === service || serviceSlug(s) === service);
      const query = new URLSearchParams();

      // Carry over only what still names something real; anything else falls
      // through to the landing rather than redirecting to an empty chart.
      if (resolved) {
        query.set("service", serviceSlug(resolved));

        const stations: string[] = explorer.stations?.[resolved] ?? [];
        if (origin && stations.includes(origin))
          query.set("origin", stationSlug(origin, explorer.all_stations));
        if (destination && stations.includes(destination))
          query.set("destination", stationSlug(destination, explorer.all_stations));
      }

      const search = query.toString();
      // A redirect from getStaticProps is not locale-aware: the destination is
      // taken literally, so without the prefix a Malay link would land on the
      // English page.
      const prefix = locale && locale !== defaultLocale ? `/${locale}` : "";
      return {
        redirect: {
          destination: `${prefix}${KTMB_EXPLORER}${search ? `?${search}` : ""}`,
          permanent: true,
        },
      };
    }

    return {
      props: {
        meta: {
          id: "dashboard-ktmb-explorer",
          type: "dashboard",
          category: "transportation",
          agency: "ktmb",
        },
        explorer,
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default KTMBExplorer;
