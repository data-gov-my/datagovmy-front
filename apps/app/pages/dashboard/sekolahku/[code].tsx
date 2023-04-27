import { GetStaticPaths, GetStaticProps } from "next";
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

export const getStaticPaths: GetStaticPaths = async () => {
  const dropdown_data = [
    { code: "PEB1094", school: "PENANG FREE SCHOOL", postcode: "11600", state: "Pulau Pinang" },
    { code: "JBA0072", school: "SK SRI BELAHAN", postcode: "83100", state: "Johor" },
    { code: "JBA0071", school: "SK MUTIARA", postcode: "83100", state: "Johor" },
    { code: "JBA0069", school: "SK RENGIT", postcode: "83100", state: "Johor" },
    { code: "JEA0017", school: "SMK PERMATA JAYA", postcode: "83100", state: "Johor" },
    { code: "JBC0013", school: "SJK(C) CHONG HWA RENGIT", postcode: "83100", state: "Johor" },
    { code: "JEE0018", school: "SMK TUN SARDON", postcode: "83100", state: "Johor" },
    { code: "JBB0022", school: "SK SRI RENGIT", postcode: "83100", state: "Johor" },
    { code: "JBA0065", school: "SK SUNGAI TONGKANG", postcode: "83100", state: "Johor" },
    { code: "JBA0066", school: "SK SERI SAMPURNA", postcode: "83100", state: "Johor" },
    { code: "JBA0067", school: "SK SERI PERPAT", postcode: "83100", state: "Johor" },
  ];

  const paths = dropdown_data.map(school => {
    return { params: { code: school.code } };
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-sekolahku",
  async ({ params }) => {
    const { data } = await get("/dashboard", { dashboard: "sekolahku", code: params?.code });

    const dropdown_data = [
      { code: "PEB1094", school: "PENANG FREE SCHOOL", postcode: "11600", state: "Pulau Pinang" },
      { code: "JBA0072", school: "SK SRI BELAHAN", postcode: "83100", state: "Johor" },
      { code: "JBA0071", school: "SK MUTIARA", postcode: "83100", state: "Johor" },
      { code: "JBA0069", school: "SK RENGIT", postcode: "83100", state: "Johor" },
      { code: "JEA0017", school: "SMK PERMATA JAYA", postcode: "83100", state: "Johor" },
      { code: "JBC0013", school: "SJK(C) CHONG HWA RENGIT", postcode: "83100", state: "Johor" },
      { code: "JEE0018", school: "SMK TUN SARDON", postcode: "83100", state: "Johor" },
      { code: "JBB0022", school: "SK SRI RENGIT", postcode: "83100", state: "Johor" },
      { code: "JBA0065", school: "SK SUNGAI TONGKANG", postcode: "83100", state: "Johor" },
      { code: "JBA0066", school: "SK SERI SAMPURNA", postcode: "83100", state: "Johor" },
      { code: "JBA0067", school: "SK SERI PERPAT", postcode: "83100", state: "Johor" },
    ];
    return {
      notFound: false,
      props: {
        dropdown_data: dropdown_data,
        sekolahku_info: data.sekolahku_info.data,
        bellcurve_school: data.bellcurve_school.data,
        bellcurve_callout: data.bellcurve_callout.data.data,
        bellcurve_linechart: data.bellcurve_linechart.data.data,
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default Sekolahku;
