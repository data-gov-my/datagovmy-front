import Metadata from "@components/Metadata";
import BirthdayExplorerDashboard from "@dashboards/demography/birthday-explorer";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";

const BirthdayExplorer = ({ timeseries }: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-birthday-explorer", "common"]);
  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.birthday_explorer")}
        description={t("description")}
        keywords={""}
      />
      <BirthdayExplorerDashboard timeseries={timeseries} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-birthday-explorer", async () => {
  const { data } = await get("/explorer", { explorer: "BIRTHDAY_POPULARITY", state: "mys" });
  return {
    props: {
      timeseries: {
        data: {
          x: data.x,
          y: data.y,
        },
      },
    },
  };
});

export default BirthdayExplorer;
