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

const EXPLORER_META = "https://storage.data.gov.my/dashboards/prasarana_explorer_meta.json";

const RapidExplorer: Page = ({
  meta,
  explorer,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-rapid-explorer");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RapidExplorerDashboard explorer={explorer} params={params} />
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
 * Path: /{service}/{origin}/{destination}
 * service - required - rail
 * origin - required - KJ10: KLCC
 * destination - required - KJ15: KL Sentral
 *
 * Every pair keeps its own URL so existing links and shares still resolve, but
 * the path no longer decides what is fetched on the server. Each path returns
 * the same static props -- the station list, which pairs are valid, and the
 * default pair's series -- and the browser queries the requested pair from the
 * parquet with DuckDB. A cold path therefore costs one 13 KB metadata fetch
 * rather than three API calls, which is what makes `fallback: "blocking"`
 * cheap here in a way it was not before.
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
    const [service, origin, destination] = params?.service ? (params.service as string[]) : [];

    const response = await fetch(EXPLORER_META);
    if (!response.ok) {
      throw new Error(`Explorer metadata fetch failed: ${response.status}`);
    }
    const explorer = await response.json();

    // A path can name a pair that does not exist -- a station closes, or the
    // link was hand-edited. Falling back to the default beats rendering a chart
    // that would always be empty.
    const known = new Set<string>(explorer.stations);
    const valid = Boolean(origin && destination && known.has(origin) && known.has(destination));

    return {
      props: {
        meta: {
          id: "dashboard-rapid-explorer",
          type: "dashboard",
          category: "transportation",
          agency: "prasarana",
        },
        explorer,
        params: {
          service: service ?? "rail",
          origin: valid ? origin : explorer.default.origin,
          destination: valid ? destination : explorer.default.destination,
        },
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RapidExplorer;
