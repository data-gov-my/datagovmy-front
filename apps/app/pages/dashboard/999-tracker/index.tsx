import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import Tracker999Dashboard from "@dashboards/healthcare/999-tracker";
import { withi18n } from "@lib/decorators";

const Tracker999: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-999-tracker"]);

  return (
    <>
      <Metadata
        title={t("dashboard-999-tracker:header")}
        description={t("dashboard-999-tracker:description")}
        keywords={""}
      />
      <Tracker999Dashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-999-tracker", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default Tracker999;
