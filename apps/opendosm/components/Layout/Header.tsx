import { FunctionComponent, ReactNode } from "react";
import { ChartBarSquareIcon, HomeIcon, RectangleGroupIcon } from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { useTranslation } from "datagovmy-ui/hooks";
import { At, Header, Nav, Megamenu } from "datagovmy-ui/components";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { clx } from "datagovmy-ui/helpers";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const OpenDOSMHeader: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation(["dashboards"]);

  // const megaMenuItems = [
  //   {
  //     title: t("categories.economy"),
  //     list: [
  //       { title: t("dashboards.labour-market.name"), link: routes.LABOUR_MARKET },
  //       { title: t("dashboards.composite-index.name"), link: routes.COMPOSITE_INDEX },
  //       { title: t("dashboards.wholesale-retail.name"), link: routes.WHOLESALE_RETAIL },
  //       {
  //         title: t("dashboards.industrial-production.name"),
  //         link: routes.INDUSTRIAL_PRODUCTION,
  //       },
  //       {
  //         title: t("dashboards.consumer-prices.name"),
  //         link: routes.CONSUMER_PRICES,
  //       },
  //       {
  //         title: t("dashboards.producer-prices.name"),
  //         link: routes.PRODUCER_PRICES,
  //       },
  //     ],
  //   },
  //   {
  //     title: t("categories.national-accounts"),
  //     list: [{ title: t("dashboards.gdp.name"), link: routes.GDP }],
  //   },
  //   {
  //     title: t("categories.demography"),
  //     list: [{ title: t("dashboards.kawasanku.name"), link: routes.KAWASANKU }],
  //   },
  // ];

  return (
    <Header>
      <Nav stateSelector={stateSelector}>
        {close => (
          <>
            <Nav.Item title={t("common:nav.home")} link="/" onClick={close} />
            <Nav.Item title={t("common:nav.dashboards")} link="/dashboard" onClick={close} />
            <Nav.Item
              title={t("common:nav.catalogue")}
              key="/data-catalogue"
              link="/data-catalogue"
              onClick={close}
            />
            <Nav.Item
              title={t("common:nav.publications")}
              key="/publications"
              link="/publications"
              onClick={close}
            />
            <Nav.Item
              title={t("common:nav.api_docs")}
              key="api_docs"
              link="https://developer.data.gov.my/static-api/opendosm"
              onClick={close}
              external
            />
            {/* DASHBOARD MEGA MENU */}
            {/* <WindowProvider>
              <Megamenu
                title={t("common:nav.dashboards")}
                icon={<RectangleGroupIcon className="h-4 w-4 text-black dark:text-white" />}
              >
                <div className="container relative mx-auto grid gap-4 px-3 py-3 md:grid-cols-4 md:gap-6 md:py-6">
                  {megaMenuItems.map(item => (
                    <div key={item.title} className="text-sm">
                      <p className="mb-2 font-bold">{item.title}</p>
                      <ul
                        className={clx(
                          "gap-4 space-y-2",
                          item.list.length > 3 ? "columns-1 lg:columns-2" : "columns-1"
                        )}
                      >
                        {item.list.map((li, index) => (
                          <li
                            key={item.title.concat(index.toString())}
                            className="text-dim hover:text-black dark:hover:text-white"
                          >
                            <At href={li.link} onClick={close}>
                              {li.title}
                            </At>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Megamenu>
            </WindowProvider> */}
          </>
        )}
      </Nav>
    </Header>
  );
};

export default OpenDOSMHeader;
