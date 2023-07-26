import { At, Container, Dropdown } from "datagovmy-ui/components";
import Image from "next/image";
import { FunctionComponent, ReactElement, useState } from "react";
import {
  HomeIcon,
  Bars3BottomRightIcon,
  RectangleGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import { languages } from "@lib/options";
import { routes } from "@lib/routes";
import { useLanguage, useTranslation } from "datagovmy-ui/hooks";

import Nav from "@components/Nav";
import NavItem from "@components/Nav/Item";
import MegaMenu from "@components/Nav/MegaMenu";
import { WindowProvider } from "datagovmy-ui/contexts/window";

interface HeaderProps {
  stateSelector?: ReactElement;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation();
  const { language, onLanguageChange } = useLanguage();

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  // TODO: build items from API
  const megaMenuItems = [
    {
      title: t("nav.megamenu.categories.infectious_diseases"),
      list: [
        { title: t("nav.megamenu.dashboards.covid_19"), link: routes.COVID },
        { title: t("nav.megamenu.dashboards.covid_19_vax"), link: routes.COVID_VAX },
      ],
    },
    // {
    //   title: t("nav.megamenu.categories.healthcare_resources"),
    //   list: [
    //     { title: t("nav.megamenu.dashboards.healthcare_facilities"), link: routes.FACILITIES },
    //     { title: t("nav.megamenu.dashboards.hospital_bed_utilisation"), link: routes.HOSPITAL_BED },
    //   ],
    // },
    {
      title: t("nav.megamenu.categories.healthcare_programs"),
      list: [
        {
          title: t("nav.megamenu.dashboards.blood_donation"),
          link: routes.BLOOD_DONATION,
        },
        { title: t("nav.megamenu.dashboards.organ_donation"), link: routes.ORGAN_DONATION },
        { title: t("nav.megamenu.dashboards.peka_b40"), link: routes.PEKA_B40 },
      ],
    },
    // {
    //   title: t("nav.megamenu.categories.misc"),
    //   list: [{ title: t("nav.megamenu.dashboards.covidnow_data"), link: routes.COVIDNOW_DATA }],
    // },
  ];

  return (
    <div className="fixed top-0 left-0 z-20 w-full">
      <Container background="bg-white" className="flex items-center gap-4 border-b py-[11px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <At href="/">
              <div className="flex cursor-pointer gap-2">
                <div className="flex w-8 items-center justify-center">
                  <Image
                    src="/static/images/logo.png"
                    width={48}
                    height={36}
                    alt="datagovmy_logo.png"
                  />
                </div>
                <h3>KKMNOW</h3>
              </div>
            </At>
            <Nav isTabletNavOpen={isTabletNavOpen}>
              <NavItem
                title={t("nav.home")}
                link="/"
                icon={<HomeIcon className="h-4 w-4 text-black" />}
              />
              {/* DASHBOARD MEGA MENU */}
              <WindowProvider>
                <MegaMenu
                  title={t("nav.dashboards")}
                  icon={<RectangleGroupIcon className="h-4 w-4 text-black" />}
                >
                  <div className="px-3 relative grid gap-4 py-3 md:grid-cols-4 md:gap-6 md:py-6">
                    {megaMenuItems.map((item, index) => (
                      <div key={item.title} className="text-sm">
                        <p className="mb-2 font-bold">{item.title}</p>
                        <ul className="flex flex-col gap-2">
                          {item.list.map((li, index) => (
                            <li
                              key={item.title.concat(index.toString())}
                              className="text-footer-link"
                            >
                              <At href={li.link} onClick={() => setIsTabletNavOpen(false)}>
                                {li.title}
                              </At>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </MegaMenu>
              </WindowProvider>
            </Nav>
          </div>
          <div className="flex items-center gap-4">
            {stateSelector}
            {/* LANGUAGE DROPDOWN */}
            <Dropdown
              selected={languages.find(lang => lang.value === language)}
              onChange={onLanguageChange}
              options={languages}
            />
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

export default Header;
