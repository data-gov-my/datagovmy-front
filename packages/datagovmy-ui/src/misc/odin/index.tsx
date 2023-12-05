import { FunctionComponent, useRef } from "react";
import { Button, Container, Hero, Section } from "../../components";
import { useTranslation } from "../../hooks";
import OdinSidebar from "./OdinSideBar";

const OdinDashboard: FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <p className="text-primary mb-3 text-center font-semibold uppercase">
            {t("international_benchmarking")}
          </p>
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim text-center">{t("description")}</p>
          <div className="flex items-center gap-2">
            <p className="text-dim text-center">{t("last_updated")}</p>
            <div className="bg-dim h-1 w-1 rounded-full" />
            <p className="text-dim text-center">{t("view_count")}</p>
          </div>
        </div>
      </Container>

      <Container className="min-h-screen max-w-full">
        <OdinSidebar />
      </Container>
    </>
  );
};

export default OdinDashboard;
