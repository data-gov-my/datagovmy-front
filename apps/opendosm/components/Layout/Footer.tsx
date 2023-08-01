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

        <a className="link-dim" href="#" target="_blank">
          {t("nav.frontend")}
        </a>
        <a className="link-dim" href="#" target="_blank">
          {t("nav.backend")}
        </a>
        <a className="link-dim" href="#" target="_blank">
          {t("nav.uiux")}
        </a>
      </div>
      {/* OPEN DATA */}
      <div className="flex w-full flex-col gap-2 md:w-auto">
        <p className="font-bold">{t("nav.open_data")}</p>

        <a className="link-dim" href="#" target="_blank">
          {t("nav.guiding_principles")}
        </a>
        <At className="link-dim" href="#">
          {t("nav.terms_of_use")}
        </At>
      </div>
    </Footer>
  );
};

export default OpenDOSMFooter;
