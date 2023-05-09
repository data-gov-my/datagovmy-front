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
  sekolahku_barmeter,
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
        sekolahku_barmeter={sekolahku_barmeter}
        bellcurve_school={bellcurve_school}
        bellcurve_callout={bellcurve_callout}
        bellcurve_linechart={bellcurve_linechart}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      {
        params: {
          code: "PEB1094",
        },
      },
      {
        params: {
          code: "PEB1094",
        },
        locale: "ms-MY",
      },
    ],
    fallback: "blocking", // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-sekolahku",
  async ({ params }) => {
    try {
      const [dropdown, school] = await Promise.all([
        get("/dropdown", { dashboard: "sekolahku", limit: 10 }),
        get("/dashboard", { dashboard: "sekolahku", code: params?.code }),
      ]).catch(e => {
        console.error(e);
        throw new Error("Invalid school code");
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "dashboard-sekolahku",
            type: "dashboard",
            category: "education",
            agency: "MoE",
          },
          dropdown_data: dropdown.data,
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
  }
);

export default Sekolahku;
