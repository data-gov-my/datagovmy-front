import Layout from "@components/Layout";
import RapidExplorerDashboard from "@dashboards/transportation/rapid-explorer";
import { get } from "datagovmy-ui/api";
import { Banner, Metadata } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { useTranslation as _useTranslation } from "next-i18next";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const RapidExplorer: Page = ({
  meta,
  A_to_B,
  A_to_B_callout,
  A_to_B_has_data,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  next_update,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-rapid-explorer");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RapidExplorerDashboard
        A_to_B={A_to_B}
        A_to_B_callout={A_to_B_callout}
        A_to_B_has_data={A_to_B_has_data}
        B_to_A={B_to_A}
        B_to_A_callout={B_to_A_callout}
        dropdown={dropdown}
        last_updated={last_updated}
        next_update={next_update}
        params={params}
      />
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
 * origin - required - KJ10
 * destination - required - KJ15
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
    const [service, origin, destination] = params?.service
      ? (params.service as string[])
      : ["rail", "KJ10: KLCC", "KJ15: KL Sentral"];

    const results = await Promise.allSettled([
      get("/explorer", { explorer: "Prasarana", dropdown: true }),
      get("/explorer", {
        explorer: "Prasarana",
        service,
        origin,
        destination,
      }),
      get("/explorer", {
        explorer: "Prasarana",
        service,
        origin: destination,
        destination: origin,
      }),
    ]);

    const [dropdown, A_to_B, B_to_A] = results.map(e => {
      if (e.status === "rejected") return {};
      else return e.value.data;
    });

    const normalizePeriod = (period: any) => ({
      x: Array.isArray(period?.x) ? period.x : [],
      passengers: Array.isArray(period?.passengers) ? period.passengers : [],
    });
    const normalizeTimeseries = (timeseries: any) => ({
      data_as_of: timeseries?.data_as_of ?? null,
      data: {
        daily: normalizePeriod(timeseries?.data?.daily),
        monthly: normalizePeriod(timeseries?.data?.monthly),
      },
    });
    const emptyCallout = { daily: 0, monthly: 0 };
    const normalized_A_to_B = normalizeTimeseries(A_to_B?.timeseries);
    const normalized_B_to_A = normalizeTimeseries(B_to_A?.timeseries);
    const hasRecords = (timeseries: ReturnType<typeof normalizeTimeseries>) =>
      timeseries.data.daily.x.length > 0 || timeseries.data.monthly.x.length > 0;
    const A_to_B_has_data = hasRecords(normalized_A_to_B);
    const B_to_A_has_data = hasRecords(normalized_B_to_A);

    return {
      props: {
        meta: {
          id: "dashboard-rapid-explorer",
          type: "dashboard",
          category: "transportation",
          agency: "prasarana",
        },
        A_to_B: normalized_A_to_B,
        A_to_B_callout: {
          ...emptyCallout,
          ...A_to_B?.timeseries_callout?.data,
        },
        A_to_B_has_data,
        B_to_A: B_to_A_has_data ? normalized_B_to_A.data : null,
        B_to_A_callout: B_to_A_has_data
          ? { ...emptyCallout, ...B_to_A?.timeseries_callout?.data }
          : null,
        dropdown: dropdown ?? {},
        last_updated: A_to_B?.data_last_updated ?? B_to_A?.data_last_updated ?? null,
        next_update: A_to_B?.data_next_update ?? B_to_A?.data_next_update ?? null,
        params: params?.service ? { service, origin, destination } : {},
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RapidExplorer;
