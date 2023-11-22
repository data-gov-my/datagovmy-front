import Image from "next/image";
import { useTranslation } from "next-i18next";
import Container from "../../components/Container";
import { FunctionComponent, ReactNode } from "react";
import { SiteName } from "../../../types";

interface FooterProps {
  title?: ReactNode;
  children?: ReactNode;
  site: SiteName;
}

const Footer: FunctionComponent<FooterProps> = ({ title, children, site }) => {
  const { t } = useTranslation();

  const getCopyrightText = (site: SiteName): string => {
    switch (site) {
      case "datagovmy":
        return t("common:nav.public_open_data");
      case "opendosm":
        return t("common:nav.public_open_data");
      case "kkmnow":
        return t("agencies:moh.full");

      default:
        return t("common:nav.public_open_data");
    }
  };

  const copyright = getCopyrightText(site);

  return (
    <Container background="bg-background dark:bg-black border-t border-outline dark:border-washed-dark pt-12 pb-16 z-10">
      <div className="flex w-full max-md:flex-col max-md:gap-8 md:justify-between">
        <div className="flex gap-4">
          {/* LOGO */}
          <div className="mt-1 w-12">
            <Image src="/static/images/jata_logo.png" width={48} height={36} alt="jata negara" />
          </div>
          <div>
            <div className="mb-2 font-bold uppercase">{title}</div>
            <p className="text-dim text-sm">
              © {new Date().getFullYear()} {copyright}
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-sm">{children}</div>
      </div>
    </Container>
  );
};

export default Footer;
