import { At, Footer } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

const KKMNOWFooter: FunctionComponent = () => {
  const { t } = useTranslation(["common", "agencies"]);
  return (
    <Footer
      title={
        <>
          <p>{t("agencies:moh.full")}</p>
          <p>{t("agencies:dosm.full")}</p>
        </>
      }
    >
      {/* OPEN SOURCE REPOS */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("nav.open_source")}</p>

        <At className="link-dim" external href="https://github.com/MoH-Malaysia/kkmnow-front">
          {t("nav.frontend")}
        </At>
        <At className="link-dim" external href="https://github.com/MoH-Malaysia/kkmnow-back">
          {t("nav.backend")}
        </At>
      </div>

      {/* OPEN DATA */}
      <div className="flex w-full flex-col gap-2 md:w-[200px]">
        <p className="font-bold">{t("nav.open_data")}</p>

        <At className="link-dim" external href="https://github.com/MoH-Malaysia/">
          Github
        </At>
        <At
          className="link-dim"
          external
          href="https://github.com/MoH-Malaysia/kkmnow-data/blob/main/README.md#larger-datasets-made-available-via-google-cloud"
        >
          Google Cloud
        </At>
      </div>
    </Footer>
  );
};

export default KKMNOWFooter;
