import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import SekolahkuDashboard from "@dashboards/education/sekolahku";
import { withi18n } from "@lib/decorators";

const Sekolahku: Page = ({
  dropdown_data,
  sekolahku_info,
  bellcurve_school,
  bellcurve_callout,
  bellcurve_linechart,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-sekolahku", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <SekolahkuDashboard
        dropdown_data={dropdown_data}
        sekolahku_info={sekolahku_info}
        bellcurve_school={bellcurve_school}
        bellcurve_callout={bellcurve_callout}
        bellcurve_linechart={bellcurve_linechart}
      />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-sekolahku", async () => {
  const { data } = await get("/dashboard", { dashboard: "sekolahku", code: "ABA0001" });

  return {
    notFound: false,
    props: {
      dropdown_data: null,
      sekolahku_info: data.sekolahku_info.data,
      bellcurve_school: data.bellcurve_school.data,
      bellcurve_callout: data.bellcurve_callout.data.data,
      bellcurve_linechart: data.bellcurve_linechart.data.data,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default Sekolahku;
