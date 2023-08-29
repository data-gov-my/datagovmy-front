import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import SekolahkuDashboard from "@dashboards/education/sekolahku";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const Sekolahku: Page = ({
  meta,
  dropdown_data,
  last_updated,
  total_schools,
  sekolahku_info,
  sekolahku_barmeter,
  bellcurve_school,
  bellcurve_callout,
  bellcurve_linechart,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-sekolahku", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <SekolahkuDashboard
        dropdown_data={dropdown_data}
        last_updated={last_updated}
        total_schools={total_schools}
        sekolahku_info={sekolahku_info}
        sekolahku_barmeter={sekolahku_barmeter}
        bellcurve_school={bellcurve_school}
        bellcurve_callout={bellcurve_callout}
        bellcurve_linechart={bellcurve_linechart}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-sekolahku", async () => {
  try {
    const [dropdown, school] = await Promise.all([
      get("/dropdown", { dashboard: "sekolahku" }),
      get("/dashboard", { dashboard: "sekolahku", code: "PEB1094" }),
    ]);

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-sekolahku",
          type: "dashboard",
          category: "education",
          agency: "MoE",
        },
        dropdown_data: dropdown.data.data,
        last_updated: school.data.data_last_updated,
        total_schools: dropdown.data.info.total,
        sekolahku_info: school.data.sekolahku_info.data,
        sekolahku_barmeter: school.data.sekolahku_barmeter.data,
        bellcurve_school: school.data.bellcurve_school.data,
        bellcurve_callout: school.data.bellcurve_callout.data.data,
        bellcurve_linechart: school.data.bellcurve_linechart.data.data,
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
});

export default Sekolahku;
