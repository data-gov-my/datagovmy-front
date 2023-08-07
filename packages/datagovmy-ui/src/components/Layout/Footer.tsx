import Image from "next/image";
import { useTranslation } from "next-i18next";
import Container from "../../components/Container";
import { FunctionComponent, ReactNode } from "react";

interface FooterProps {
  title?: ReactNode;
  children?: ReactNode;
}

const Footer: FunctionComponent<FooterProps> = ({ title, children }) => {
  const { t } = useTranslation();

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
              © {new Date().getFullYear()} {t("common:nav.public_open_data")}
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-sm">{children}</div>
      </div>
    </Container>
  );
};

export default Footer;
