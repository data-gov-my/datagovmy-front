import { At, Footer } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

const OpenDOSMFooter: FunctionComponent = () => {
  const { t } = useTranslation(["common", "agencies"]);
  return (
    <Footer title={<p>{t("agencies:dosm.full")}</p>}>
      {/* OPEN SOURCE REPOS */}
      <div className="flex w-full flex-col gap-2 md:w-auto">
        <p className="font-bold">{t("nav.open_source")}</p>

        <At className="link-dim" external href="https://github.com/dosm-malaysia/aksara-front">
          {t("nav.frontend")}
        </At>
        <At className="link-dim" external href="https://github.com/dosm-malaysia/aksara-back">
          {t("nav.backend")}
        </At>
      </div>

      {/* OPEN DATA */}
      <div className="flex w-full flex-col gap-2 md:w-auto">
        <p className="font-bold">{t("nav.open_data")}</p>

        <At className="link-dim" external href="https://github.com/dosm-malaysia/">
          Github
        </At>
      </div>
    </Footer>
  );
};

export default OpenDOSMFooter;
