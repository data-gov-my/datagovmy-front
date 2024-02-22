import { FunctionComponent, useContext } from "react";
import { Container } from "../../components";
import { useTranslation } from "../../hooks";
import OdinSidebar from "./OdinSideBar";
import { numFormat, toDate } from "../../lib/helpers";
import { AnalyticsContext } from "../../contexts/analytics";

type OdinProps = {
  bar_chart: any;
  keystats: any;
  last_updated: string;
  links: any;
  table: any;
};

const OdinDashboard: FunctionComponent<OdinProps> = ({
  bar_chart,
  keystats,
  last_updated,
  links,
  table,
}) => {
  const { t, i18n } = useTranslation(["odin", "common"]);
  const { result } = useContext(AnalyticsContext);

  return (
    <>
      <Container background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black border-b dark:border-washed-dark relative">
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <p className="text-primary mb-3 text-center font-semibold uppercase">
            {t("international_benchmarking")}
          </p>
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim max-w-prose text-center xl:max-w-[960px]">{t("description")}</p>
          <div className="text-dim flex items-center gap-2 text-center">
            {t("common:common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
            {result?.total_views && (
              <>
                •
                <p>{`${numFormat(result.total_views, "standard")} 
                  ${t("common:common.views", {
                    count: result.total_views,
                  })}`}</p>
              </>
            )}
          </div>
        </div>
      </Container>

      <Container className="min-h-screen max-w-full">
        <OdinSidebar bar_chart={bar_chart} keystats={keystats} links={links} table={table} />
      </Container>
    </>
  );
};

export default OdinDashboard;
