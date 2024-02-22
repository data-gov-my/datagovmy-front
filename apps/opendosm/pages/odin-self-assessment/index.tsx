import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { OdinDashboard } from "datagovmy-ui/misc";
import { get } from "datagovmy-ui/api";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const OdinPage: Page = ({
  bar_chart,
  keystats,
  last_updated,
  meta,
  links,
  table,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("odin");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <OdinDashboard
        bar_chart={bar_chart}
        keystats={keystats}
        last_updated={last_updated}
        links={links}
        table={table}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("odin", async ({ locale }) => {
  const { data } = await get("/dashboard", {
    dashboard: "odin",
    lang: locale!.slice(0, 2),
  });

  return {
    notFound: false,
    props: {
      meta: {
        id: "odin",
        type: "misc",
        category: null,
        agency: null,
      },
      bar_chart: data.bar_chart.data,
      keystats: data.keystats.data,
      last_updated: data.data_last_updated,
      links: data.links.data,
      table: data.table.data,
    },
  };
});

export default OdinPage;
