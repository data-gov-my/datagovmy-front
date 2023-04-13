import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "@hooks/useTranslation";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useLanguage } from "@hooks/useLanguage";
import Nav from "@components/Nav";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";
import Button from "@components/Button";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation("common");

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-30 w-full border-b dark:border-washed-dark">
      <Container background="bg-white dark:bg-black" className="flex items-center gap-4 py-[11px]">
        <div className="flex w-full items-center gap-4">
          <Link href="/">
            <div className="flex cursor-pointer gap-2">
              <div className="flex w-8 items-center justify-center">
                <Image src="/static/images/logo.png" width={48} height={36} alt="datagovmy_logo" />
              </div>
              <h4>data.gov.my</h4>
            </div>
          </Link>

          <Nav stateSelector={stateSelector}>
            {close => (
              <>
                <Nav.Item key={"/"} title={t("nav.home")} link="/" onClick={close} />
                <Nav.Item
                  title={t("nav.dashboards")}
                  link="/dashboard"
                  key="/dashboard"
                  onClick={close}
                />
                <Nav.Item
                  title={t("nav.catalogue")}
                  key="/data-catalogue"
                  link="/data-catalogue"
                  onClick={close}
                />

                <Nav.Item title={"API Docs"} link="#" onClick={close} />
                <Nav.Item title={"Articles"} link="#" onClick={close} />
                <Nav.Item title={"Request Data"} link="#" onClick={close} />
              </>
            )}
          </Nav>
        </div>
      </Container>
    </div>
  );
};

export default Header;
