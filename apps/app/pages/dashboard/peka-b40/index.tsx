import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import PekaB40Dashboard from "@dashboards/healthcare/peka-b40";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";

const PekaB40: Page = ({
  meta,
  last_updated,
  params,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-peka-b40", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PekaB40Dashboard
        params={params}
        last_updated={last_updated}
        timeseries={timeseries}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

PekaB40.layout = (page, props) => (
  <WindowProvider>
    <Layout
      className={clx(body.variable, "font-sans")}
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.PEKA_B40}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.PEKA_B40} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n("dashboard-peka-b40", async () => {
  const { data } = await get("/dashboard", { dashboard: "peka_b40", state: "mys" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-peka-b40",
        type: "dashboard",
        category: "healthcare",
        agency: "PHCorp",
      },
      last_updated: data.data_last_updated,
      params: { state: "mys" },
      timeseries: data.timeseries,
      choropleth: data.choropleth_malaysia,
    },
  };
});

export default PekaB40;
