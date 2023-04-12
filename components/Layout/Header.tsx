import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "@hooks/useTranslation";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
import { languages } from "@lib/options";
import { useTheme } from "next-themes";
import { useLanguage } from "@hooks/useLanguage";
import Nav from "@components/Nav";
import NavItem from "@components/Nav/Item";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";
import Button from "@components/Button";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation("common");
  const { language, onLanguageChange } = useLanguage();

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-30 w-full border-b dark:border-washed-dark">
      <Container background="bg-white dark:bg-black" className="flex items-center gap-4 py-[11px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex cursor-pointer gap-2">
                <div className="flex w-8 items-center justify-center">
                  <Image
                    src="/static/images/logo.png"
                    width={48}
                    height={36}
                    alt="datagovmy_logo"
                  />
                </div>
                <h4>data.gov.my</h4>
              </div>
            </Link>
            <Nav isTabletNavOpen={isTabletNavOpen}>
              <NavItem
                key={"/"}
                title={t("nav.home")}
                link="/"
                onClick={() => setIsTabletNavOpen(false)}
              />
              <NavItem
                title={t("nav.dashboards")}
                link="/dashboard"
                key="/dashboard"
                onClick={() => setIsTabletNavOpen(false)}
              />
              <NavItem
                title={t("nav.catalogue")}
                key="/data-catalogue"
                link="/data-catalogue"
                onClick={() => setIsTabletNavOpen(false)}
              />

              <NavItem title={"API Docs"} link="#" onClick={() => setIsTabletNavOpen(false)} />
              <NavItem title={"Articles"} link="#" onClick={() => setIsTabletNavOpen(false)} />
              <NavItem title={"Request Data"} link="#" onClick={() => setIsTabletNavOpen(false)} />
            </Nav>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            {stateSelector}
            <ThemeToggle />

            {/* LANGUAGE DROPDOWN */}
            <Dropdown
              width="w-fit"
              selected={languages.find(lang => lang.value === language)}
              onChange={onLanguageChange}
              options={languages}
            />
            {/* MOBILE NAV ICONS */}
            {isTabletNavOpen ? (
              <XMarkIcon
                className="box-content block h-5 w-5 text-black dark:text-white lg:hidden"
                onClick={() => setIsTabletNavOpen(false)}
              />
            ) : (
              <Bars3BottomRightIcon
                className="box-content block h-5 w-5 text-black dark:text-white lg:hidden"
                onClick={() => setIsTabletNavOpen(true)}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Button
        className="group relative hover:bg-washed dark:hover:bg-washed-dark"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Transition
          show={theme === "light"}
          enter="delay-200 transition ease-out duration-150"
          enterFrom=" opacity-0 translate-y-1"
          enterTo=" opacity-100 translate-y-0"
          leave="duration-150"
          leaveFrom="absolute opacity-100 translate-y-0"
          leaveTo="absolute opacity-0 translate-y-1"
        >
          <MoonIcon className=" h-4 w-4 text-dim group-hover:text-black" />
        </Transition>
        <Transition
          show={theme !== "light"}
          enter="delay-200 transition ease-out duration-150"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="duration-150"
          leaveFrom="absolute  opacity-100 translate-y-0"
          leaveTo="absolute  opacity-0 translate-y-1"
        >
          <SunIcon className="-m-0.5 h-5 w-5 text-dim dark:group-hover:text-white" />
        </Transition>
      </Button>
    </>
  );
};

export default Header;
