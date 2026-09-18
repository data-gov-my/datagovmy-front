import Layout from "@components/Layout";
import RapidExplorerDashboard from "@dashboards/transportation/rapid-explorer";
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
import { stationSlug } from "@dashboards/transportation/rapid-explorer/slug";

const EXPLORER_META = "https://storage.data.gov.my/dashboards/prasarana_explorer_meta.json";
const RAPID_EXPLORER = routes.RAPID_EXPLORER;

const RapidExplorer: Page = ({
  meta,
  explorer,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-rapid-explorer");

  return (
    <AnalyticsProvider meta={meta}>
      <Head>
        {/*
          The explorer reaches three origins the moment DuckDB starts warming:
          the WASM bundle, the parquet extension, and the data itself. Opening
          those connections during the initial render means the warm-up is not
          also paying for DNS and TLS on each.
        */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://extensions.duckdb.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://storage.data.gov.my" crossOrigin="anonymous" />
      </Head>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RapidExplorerDashboard explorer={explorer} />
    </AnalyticsProvider>
  );
};

RapidExplorer.layout = (page, props) => {
  return (
    <Layout
      className={clx(body.variable, "font-sans")}
      banner={{
        namespace: "dashboard-rapid-explorer",
        key: "caveats",
        className:
          "border-y border-[#E4E4E7] bg-[#FAFAFA] text-[#3F3F46] [&>div>div>div>p>a]:text-[#3F3F46]",
      }}
    >
      {page}
    </Layout>
  );
};

/**
 * The explorer lives at one URL, with the pair in the query string:
 *
 *   /dashboard/rapid-explorer?origin=kj10-klcc&destination=kj15-kl-sentral
 *
 * It used to be a catch-all path of raw station labels, which encoded into
 * `/rail/KJ10%3A%20KLCC/KJ15%3A%20KL%20Sentral` -- unreadable, and unpleasant
 * to paste anywhere. Those links are still out in the world, so this route
 * stays to catch them and answers with a permanent redirect to the slug form.
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
  "dashboard-rapid-explorer",
  async ({ params }) => {
    const response = await fetch(EXPLORER_META);
    if (!response.ok) {
      throw new Error(`Explorer metadata fetch failed: ${response.status}`);
    }
    const explorer = await response.json();

    // Old-style link: /{service}/{origin}/{destination}, labels and all.
    const segments = (params?.service as string[] | undefined) ?? [];
    if (segments.length) {
      const [, origin, destination] = segments.map(segment => {
        try {
          return decodeURIComponent(segment);
        } catch {
          return segment;
        }
      });

      const known = new Set<string>(explorer.stations);
      const query = new URLSearchParams();
      // Carry over only what still names a real station; anything else falls
      // through to the landing rather than redirecting to an empty chart.
      if (origin && known.has(origin))
        query.set("origin", stationSlug(origin, explorer.all_stations));
      if (destination && known.has(destination))
        query.set("destination", stationSlug(destination, explorer.all_stations));

      const search = query.toString();
      return {
        redirect: {
          destination: `${RAPID_EXPLORER}${search ? `?${search}` : ""}`,
          permanent: true,
        },
      };
    }

    return {
      props: {
        meta: {
          id: "dashboard-rapid-explorer",
          type: "dashboard",
          category: "transportation",
          agency: "prasarana",
        },
        explorer,
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RapidExplorer;
