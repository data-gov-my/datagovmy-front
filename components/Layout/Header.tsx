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
      <Container background="bg-white dark:bg-black" className="flex items-center gap-4  py-[11px]">
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
              <NavItem title={t("nav.home")} link="/" onClick={() => setIsTabletNavOpen(false)} />
              <NavItem
                title={t("nav.catalogue")}
                link="/data-catalogue"
                onClick={() => setIsTabletNavOpen(false)}
              />
              <NavItem
                title={t("nav.dashboards")}
                link="/dashboard"
                onClick={() => setIsTabletNavOpen(false)}
              />

              <NavItem title={"API Docs"} link="#" onClick={() => setIsTabletNavOpen(false)} />
              <NavItem title={"Articles"} link="#" onClick={() => setIsTabletNavOpen(false)} />
              <NavItem title={"Request Data"} link="#" onClick={() => setIsTabletNavOpen(false)} />

              <div className="block md:hidden">
                <ThemeToggle />
              </div>
            </Nav>
          </div>
          <div className="flex items-center gap-4">
            {stateSelector}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* LANGUAGE DROPDOWN */}
            <Dropdown
              selected={languages.find(lang => lang.value === language)}
              onChange={onLanguageChange}
              options={languages}
            />
            {/* MOBILE NAV ICONS */}
            {isTabletNavOpen ? (
              <XMarkIcon
                className="block h-5 w-5 text-black dark:text-white md:hidden"
                onClick={() => setIsTabletNavOpen(false)}
              />
            ) : (
              <Bars3BottomRightIcon
                className="block h-5 w-5 text-black dark:text-white md:hidden"
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
  const options = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <Button
        className="group relative hidden overflow-hidden hover:bg-washed dark:hover:bg-washed-dark md:block"
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
          <MoonIcon className=" h-4 w-4 text-dim  group-hover:text-black " />
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

      <div className="flex items-center justify-between gap-2 px-2 pt-1.5 text-sm font-medium md:hidden">
        <p>{t("components.theme")}</p>

        <Dropdown
          width="w-fit"
          onChange={_theme => setTheme(_theme?.value)}
          placeholder={theme}
          selected={options.find(_theme => _theme.value === theme)}
          options={options}
        />
      </div>
    </>
  );
};

export default Header;
