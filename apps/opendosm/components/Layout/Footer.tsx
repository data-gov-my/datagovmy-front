import Image from "next/image";
import { useTranslation } from "next-i18next";

import Container from "@components/Container";
import At from "@components/At";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Container background="bg-washed py-12">
      <div className="flex w-full flex-col gap-6 text-sm md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-row gap-4">
          {/* LOGO */}
          <div className="mt-1 w-12">
            <Image src="/static/images/logo.png" width={48} height={36} />
          </div>
          <div>
            <div className="mb-2 uppercase">
              <p className="text-base font-bold">{t("nav.dosm")}</p>
            </div>
            <p className="text-dim">
              © {new Date().getFullYear()} {t("nav.dosm")} (DOSM)
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-8 md:gap-14">
          {/* OPEN SOURCE CODE */}
          <div className="flex w-full flex-col gap-2 md:w-auto">
            <p className="font-bold">{t("nav.open_source")}</p>

            <a
              className="text-footer-link"
              href="https://github.com/dosm-malaysia/aksara-front"
              target="_blank"
            >
              {t("nav.frontend")}
            </a>
            <a
              className="text-footer-link"
              href="https://github.com/dosm-malaysia/aksara-back"
              target="_blank"
            >
              {t("nav.backend")}
            </a>
          </div>
          {/* OPEN SOURCE DATA */}
          <div className="flex w-full flex-col gap-2 md:w-auto">
            <p className="font-bold">{t("nav.open_data")}</p>

            <a className="text-footer-link" href="https://github.com/dosm-malaysia" target="_blank">
              {t("nav.github")}
            </a>
            <At className="text-footer-link" href="/data-catalogue">
              {t("nav.data_catalogue")}
            </At>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Footer;
