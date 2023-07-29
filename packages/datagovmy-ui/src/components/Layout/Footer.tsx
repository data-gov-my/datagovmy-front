import Image from "next/image";
import { useTranslation } from "next-i18next";

import Container from "../../components/Container";
import At from "../../components/At";
import { FunctionComponent, ReactNode } from "react";

interface FooterProps {
  title?: ReactNode;
  children?: ReactNode;
}

const Footer: FunctionComponent<FooterProps> = ({ title, children }) => {
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
            <div className="mb-2 text-base font-bold uppercase">
              {title}
              {/* <p className="">{t("common:nav.gov")}</p> */}
            </div>
            <p className="text-dim">
              © {new Date().getFullYear()} {t("common:nav.public_open_data")}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-8 md:gap-14">{children}</div>
      </div>
    </Container>
  );
};

export default Footer;
