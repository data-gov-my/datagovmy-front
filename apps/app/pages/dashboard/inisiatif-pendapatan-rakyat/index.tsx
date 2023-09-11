import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import IPRDashboard from "@dashboards/government-programs/inisiatif-pendapatan-rakyat";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import type { Page } from "datagovmy-ui/types";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";

/**
 * Inisiatif Pendapatan Rakyat Dashboard
 * @overview Status: In-development. Slated for future release.
 */

const IPR: Page = ({
  meta,
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-inisiatif-pendapatan-rakyat", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <IPRDashboard
        choropleth={choropleth}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

IPR.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.INISIATIF_PENDAPATAN_RAKYAT}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.INISIATIF_PENDAPATAN_RAKYAT} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-inisiatif-pendapatan-rakyat",
  async () => {
    const { data } = await get("/dashboard", {
      dashboard: "ipr",
      state: "mys",
    });

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: "dashboard-inisiatif-pendapatan-rakyat",
          type: "dashboard",
          category: "government-programs",
          agency: "EPU",
        },
        choropleth: data.choropleth,
        last_updated: data.data_last_updated,
        params: { state: "mys" },
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout.data,
      },
    };
  }
);

export default IPR;
