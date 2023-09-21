import { At, Footer } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

const OpenDOSMFooter: FunctionComponent = () => {
  const { t } = useTranslation(["common", "agencies"]);
  return (
    <Footer title={<p>{t("agencies:dosm.full")}</p>}>
      {/* OPEN SOURCE REPOS */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("nav.open_source")}</p>

        <At className="link-dim" external href="https://github.com/data-gov-my/datagovmy-front">
          {t("nav.frontend")}
        </At>
        <At className="link-dim" external href="https://github.com/data-gov-my/datagovmy-back/">
          {t("nav.backend")}
        </At>
        <At className="link-dim" external href="https://www.figma.com/file/6iNojR8hO5bWvH0c3rvGD4">
          {t("common:nav.uiux")}
        </At>
      </div>

      {/* OPEN DATA */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("nav.open_data")}</p>

        <At className="link-dim" external href="https://data.gov.my/">
          data.gov.my
        </At>
      </div>
    </Footer>
  );
};

export default OpenDOSMFooter;
