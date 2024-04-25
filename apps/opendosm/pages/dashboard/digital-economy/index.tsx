import Business from "@dashboards/digital-economy/business";
import Ecommerce from "@dashboards/digital-economy/ecommerce";
import Layout from "@dashboards/digital-economy/layout";
import Society from "@dashboards/digital-economy/society";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const DigitalEconomy: Page = ({
  last_updated,
  next_update,
  meta,
  business_choropleth,
  business_timeseries,
  ecommerce_choropleth,
  ecommerce_timeseries,
  ecommerce_timeseries_callout,
  society_choropleth,
  society_timeseries,
  society_timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboard-digital-economy");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} />
      <Layout last_updated={last_updated} next_update={next_update}>
        {tab => (
          <>
            {
              {
                businesses: (
                  <Business choropleth={business_choropleth} timeseries={business_timeseries} />
                ),
                society: (
                  <Society
                    choropleth={society_choropleth}
                    timeseries={society_timeseries}
                    timeseries_callout={society_timeseries_callout}
                  />
                ),
                ecommerce: (
                  <Ecommerce
                    choropleth={ecommerce_choropleth}
                    timeseries={ecommerce_timeseries}
                    timeseries_callout={ecommerce_timeseries_callout}
                  />
                ),
              }[tab]
            }
          </>
        )}
      </Layout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-digital-economy", async () => {
  try {
    const results = await Promise.allSettled([
      get("/dashboard", {
        dashboard: "digital_business",
      }),
      get("/dashboard", {
        dashboard: "digital_society",
      }),
      get("/dashboard", {
        dashboard: "digital_ecommerce",
      }),
    ]);

    const [business, society, ecommerce] = results.map(e => {
      if (e.status === "rejected") return {};
      else return e.value.data;
    });

    return {
      props: {
        meta: {
          id: "dashboard-digital-economy",
          type: "dashboard",
          category: "economy",
          agency: "DOSM",
        },
        last_updated: business.data_last_updated,
        next_update: business.data_next_update,
        business_choropleth: business.choropleth_state,
        business_timeseries: business.timeseries,
        society_choropleth: society.choropleth_state,
        society_timeseries: society.timeseries,
        society_timeseries_callout: society.timeseries_callout,
        ecommerce_choropleth: ecommerce.choropleth_state,
        ecommerce_timeseries: ecommerce.timeseries,
        ecommerce_timeseries_callout: ecommerce.timeseries_callout,
      },
    };
  } catch (error: any) {
    console.error(error.message);
    return { notFound: true };
  }
});

export default DigitalEconomy;