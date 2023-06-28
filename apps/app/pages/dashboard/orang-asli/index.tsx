import { Metadata } from "@components/index";
import OrangAsliDashboard from "@dashboards/demography/orang-asli";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";

const OrangAsli: Page = ({
  dropdown,
  meta,
  params,
  village,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-orang-asli", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <OrangAsliDashboard dropdown={dropdown} params={params} village={village} />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-orang-asli", async () => {
  const { data } = await get("/dashboard", {
    dashboard: "orang_asli",
    slug: "kampung-rps-runchang-pekan-pahang",
  });
  const { data: dropdown } = await get("/dropdown", { dashboard: "orang_asli" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-orang-asli",
        type: "dashboard",
        category: "demography",
        agency: "JAKOA",
      },
      dropdown: dropdown.data,
      params: {},
      village: data,
    },
  };
});

export default OrangAsli;
