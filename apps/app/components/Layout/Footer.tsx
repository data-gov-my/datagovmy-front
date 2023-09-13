import { At, Footer } from "datagovmy-ui/components";
import { useTranslation } from "next-i18next";

const DGMYFooter = () => {
  const { t } = useTranslation();

  return (
    <Footer title={t("common:nav.gov")}>
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

        <At
          className="link-dim"
          external
          href="https://dasar.mampu.gov.my/search-g/download-file/25/7f821c650c868d025fb5351d7d45d001"
        >
          {t("common:nav.guiding_principles")}
        </At>
        <At className="link-dim" external href="https://open.dosm.gov.my">
          OpenDOSM
        </At>
      </div>
    </Footer>
  );
};

export default DGMYFooter;
