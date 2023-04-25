import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CircleofLifeDashboard from "@dashboards/demography/circle-of-life";
import { withi18n } from "@lib/decorators";

const CircleofLife: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-circle-of-life"]);

  return (
    <>
      <Metadata
        title={t("dashboard-circle-of-life:header")}
        description={t("dashboard-circle-of-life:description")}
        keywords={""}
      />
      <CircleofLifeDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-circle-of-life", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default CircleofLife;
