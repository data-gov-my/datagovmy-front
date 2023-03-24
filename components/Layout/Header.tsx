import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, ReactElement, useState, Fragment, useEffect, useContext } from "react";
import { useTranslation } from "@hooks/useTranslation";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
import { languages } from "@lib/options";
import { useTheme } from "next-themes";
import { routes } from "@lib/routes";
import { useLanguage } from "@hooks/useLanguage";
import Nav from "@components/Nav";
import NavItem from "@components/Nav/Item";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";
import MegaMenu from "@components/Nav/MegaMenu";
import Button from "@components/Button";

interface HeaderProps {
  stateSelector?: ReactElement;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation("common");
  const { language, onLanguageChange } = useLanguage();

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  const megaMenuItems = [
    {
      title: t("nav.megamenu.categories.economy"),
      list: [
        // { title: t("nav.megamenu.dashboards.labour_market"), link: routes.LABOUR_MARKET },
        // { title: t("nav.megamenu.dashboards.composite_index"), link: routes.COMPOSITE_INDEX },
        // { title: t("nav.megamenu.dashboards.wholesale_retail"), link: routes.WHOLESALE_RETAIL },
        // {
        //   title: t("nav.megamenu.dashboards.industrial_production"),
        //   link: routes.INDUSTRIAL_PRODUCTION,
        // },
        {
          title: t("nav.megamenu.dashboards.consumer_prices"),
          link: routes.CONSUMER_PRICES,
        },
        // {
        //   title: t("nav.megamenu.dashboards.producer_prices"),
        //   link: routes.PRODUCER_PRICES,
        // },
        { title: t("nav.megamenu.dashboards.exchange_rate"), link: routes.EXCHANGE_RATE },
        { title: t("nav.megamenu.dashboards.gdp"), link: routes.GDP },
        // Menu hidden until further notice
        // {
        //   title: t("nav.megamenu.dashboards.rubber"),
        //   link: routes.RUBBER,
        // },
      ],
    },
    {
      title: t("nav.megamenu.categories.financial_sector"),
      list: [
        {
          title: t("nav.megamenu.dashboards.currency_in_circulation"),
          link: routes.CURRENCY_IN_CIRCULATION,
        },
        {
          title: t("nav.megamenu.dashboards.money_supply"),
          link: routes.MONEY_SUPPLY,
        },
        {
          title: t("nav.megamenu.dashboards.reserve_money"),
          link: routes.RESERVE_MONEY,
        },
        {
          title: t("nav.megamenu.dashboards.international_reserves"),
          link: routes.INTERNATIONAL_RESERVES,
        },
        {
          title: t("nav.megamenu.dashboards.interest_rates"),
          link: routes.INTEREST_RATES,
        },
      ],
    },
    // {
    //   title: t("nav.megamenu.categories.social"),
    //   list: [
    //     { title: t("nav.megamenu.dashboards.crime"), link: routes.CRIME },
    //     { title: t("nav.megamenu.dashboards.drug"), link: routes.DRUG },
    //   ],
    // },
    // {
    //   title: t("nav.megamenu.categories.national_accounts"),
    //   list: [{ title: t("nav.megamenu.dashboards.gdp"), link: routes.GDP }],
    // },
    // {
    //   title: t("nav.megamenu.categories.demography"),
    //   list: [{ title: t("nav.megamenu.dashboards.kawasanku"), link: routes.KAWASANKU }],
    // },
    {
      title: t("nav.megamenu.categories.healthcare"),
      list: [{ title: t("nav.megamenu.dashboards.blood_donation"), link: routes.BLOOD_DONATION }],
    },
  ];

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
              {/* DASHBOARD MEGA MENU */}
              {/* <MegaMenu title={t("nav.dashboards")}>
                <Container className="relative grid max-h-[70vh] grid-cols-2 gap-8 overflow-auto py-3 lg:grid-cols-3 lg:gap-12 lg:py-6">
                  {megaMenuItems.map(item => (
                    <div key={item.title} className="text-sm">
                      <p className="mb-2 font-bold">{item.title}</p>
                      <ul
                        className={[
                          "gap-4 space-y-2",
                          item.list.length > 3 ? "columns-1 lg:columns-2" : "columns-1",
                        ].join(" ")}
                      >
                        {item.list.map((li, index) => (
                          <li
                            key={item.title.concat(index.toString())}
                            className="text-dim hover:text-black dark:hover:text-white"
                          >
                            <Link href={li.link} onClick={() => setIsTabletNavOpen(false)}>
                              {li.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Container>
              </MegaMenu> */}

              <NavItem
                title={"Dashboards"}
                link="/dashboards"
                // icon={<ChartBarSquareIcon className="h-5 w-5 text-black" />}
                onClick={() => setIsTabletNavOpen(false)}
              />

              <NavItem
                title={"API Docs"}
                link="/data-catalogue"
                // icon={<ChartBarSquareIcon className="h-5 w-5 text-black" />}
                onClick={() => setIsTabletNavOpen(false)}
              />
              <NavItem
                title={"Articles"}
                link="/data-catalogue"
                // icon={<ChartBarSquareIcon className="h-5 w-5 text-black" />}
                onClick={() => setIsTabletNavOpen(false)}
              />
              <NavItem
                title={"Request Data"}
                link="/data-catalogue"
                // icon={<ChartBarSquareIcon className="h-5 w-5 text-black" />}
                onClick={() => setIsTabletNavOpen(false)}
              />
            </Nav>
          </div>
          <div className="flex items-center gap-4">
            {stateSelector}
            <ThemeToggle />
            {/* LANGUAGE DROPDOWN */}
            <Dropdown selected={language} onChange={onLanguageChange} options={languages} />
            {/* MOBILE NAV ICONS */}
            {isTabletNavOpen ? (
              <XMarkIcon
                className="block h-5 w-5 text-black md:hidden"
                onClick={() => setIsTabletNavOpen(false)}
              />
            ) : (
              <Bars3BottomRightIcon
                className="block h-5 w-5 text-black md:hidden"
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
        className="group relative overflow-hidden hover:bg-washed dark:hover:bg-washed-dark"
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
    </>
  );
};

export default Header;
