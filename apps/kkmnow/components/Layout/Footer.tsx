import { At, Footer } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

const KKMNOWFooter: FunctionComponent = () => {
  const { t } = useTranslation(["common", "agencies"]);
  return (
    <Footer title={t("agencies:moh.full")} site="kkmnow">
      {/* OPEN SOURCE CODE */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("common:nav.open_source")}</p>

        <At className="link-dim" external href="https://github.com/data-gov-my/datagovmy-front">
          {t("common:nav.frontend")}
        </At>
        <At className="link-dim" external href="https://github.com/data-gov-my/datagovmy-back">
          {t("common:nav.backend")}
        </At>
        <At className="link-dim" external href="https://github.com/data-gov-my/datagovmy-ai">
          {t("common:nav.ai")}
        </At>
        <At className="link-dim" external href="https://www.figma.com/file/6iNojR8hO5bWvH0c3rvGD4">
          {t("common:nav.uiux")}
        </At>
      </div>

      {/* OPEN SOURCE DATA */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("common:nav.open_data")}</p>

        <At className="link-dim" external href="https://data.gov.my">
          data.gov.my
        </At>
        <At className="link-dim" external href="https://open.dosm.gov.my">
          OpenDOSM
        </At>
      </div>
    </Footer>
  );
};

export default KKMNOWFooter;
