import { Metadata } from "@components/index";
import OrangAsliDashboard from "@dashboards/demography/orang-asli";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";

const OrangAsliKampung: Page = ({
  dropdown,
  meta,
  params,
  village,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-orang-asli", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={village.village_data.data[0].village.concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
      <OrangAsliDashboard dropdown={dropdown} params={params} village={village} />
    </AnalyticsProvider>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-orang-asli",
  async ({ params }) => {
    const { data } = await get("/dashboard", {
      dashboard: "orang_asli",
      slug: params?.kampung,
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
        params: { kampung: params?.kampung },
        village: data,
      },
    };
  }
);

export default OrangAsliKampung;
