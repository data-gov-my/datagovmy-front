// import { HomeIcon, RectangleGroupIcon } from "@heroicons/react/24/solid";
// import { routes } from "@lib/routes";
import { At, Header, Nav, Megamenu } from "datagovmy-ui/components";
// import { WindowProvider } from "datagovmy-ui/contexts/window";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const KKMNOWHeader: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation(["dashboards"]);
  // const megaMenuItems = [
  //   {
  //     title: t("categories.infectious-diseases"),
  //     list: [
  //       { title: t("dashboards.covid-19.name"), link: routes.COVID_19 },
  //       { title: t("dashboards.covid-vaccination.name"), link: routes.COVID_VACCINATION },
  //     ],
  //   },
  //   {
  //     title: t("categories.healthcare-resources"),
  //     list: [{ title: t("dashboards.hospital-bed-utilisation.name"), link: routes.HOSPITAL_BED_UTILISATION }],
  //   },
  //   {
  //     title: t("categories.healthcare-programs"),
  //     list: [
  //       {
  //         title: t("dashboards.blood-donation.name"),
  //         link: routes.BLOOD_DONATION,
  //       },
  //       { title: t("dashboards.organ-donation.name"), link: routes.ORGAN_DONATION },
  //       { title: t("dashboards.peka-b40.name"), link: routes.PEKA_B40 },
  //     ],
  //   },
  // ];

  return (
    <Header>
      <Nav stateSelector={stateSelector}>
        {close => (
          <>
            <Nav.Item title={t("common:nav.home")} link="/" onClick={close} />
            <Nav.Item title={t("common:nav.dashboards")} link="/dashboard" onClick={close} />
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
                      <ul className="flex flex-col gap-2">
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

export default KKMNOWHeader;
