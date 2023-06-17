import Image from "next/image";
import { useTranslation } from "next-i18next";

import Container from "../Container";
import At from "../At";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Container background="bg-washed dark:bg-black border-t border-outline dark:border-washed-dark pt-12 pb-16 z-10">
      <div className="flex w-full flex-col gap-6 text-sm md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-row gap-4">
          {/* LOGO */}
          <div className="mt-1 w-12">
            <Image src="/static/images/jata_logo.png" width={48} height={36} alt="jata negara" />
          </div>
          <div>
            <div className="mb-2 uppercase">
              <p className="text-base font-bold">{t("common:nav.gov")}</p>
            </div>
            <p className="text-dim">
              © {new Date().getFullYear()} {t("common:nav.public_open_data")}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-8 md:gap-14">
          {/* OPEN SOURCE CODE */}
          <div className="flex w-full flex-col gap-2 md:w-auto">
            <p className="font-bold">{t("common:nav.open_source")}</p>

            <a className="text-footer-link" href="#" target="_blank">
              {t("common:nav.frontend")}
            </a>
            <a className="text-footer-link" href="#" target="_blank">
              {t("common:nav.backend")}
            </a>
            <a className="text-footer-link" href="#" target="_blank">
              {t("common:nav.uiux")}
            </a>
          </div>
          {/* OPEN SOURCE DATA */}
          <div className="flex w-full flex-col gap-2 md:w-auto">
            <p className="font-bold">{t("common:nav.open_data")}</p>

            <a className="text-footer-link" href="#" target="_blank">
              {t("common:nav.guiding_principles")}
            </a>
            <At className="text-footer-link" href="#">
              {t("common:nav.terms_of_use")}
            </At>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Footer;
