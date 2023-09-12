import { At, Footer } from "datagovmy-ui/components";
import { useTranslation } from "next-i18next";

const DGMYFooter = () => {
  const { t } = useTranslation();

  return (
    <Footer title={t("common:nav.gov")}>
      {/* OPEN SOURCE CODE */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("common:nav.open_source")}</p>

        <At className="link-dim" external href="#">
          {t("common:nav.frontend")}
        </At>
        <At className="link-dim" external href="#">
          {t("common:nav.backend")}
        </At>
        <At className="link-dim" external href="#">
          {t("common:nav.uiux")}
        </At>
      </div>

      {/* OPEN SOURCE DATA */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("common:nav.open_data")}</p>

        <At className="link-dim" external href="#">
          {t("common:nav.guiding_principles")}
        </At>
        <At className="link-dim" external href="#">
          {t("common:nav.terms_of_use")}
        </At>
      </div>
    </Footer>
  );
};

export default DGMYFooter;
