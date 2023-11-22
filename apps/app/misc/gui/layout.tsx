import { At, AgencyBadge, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useEffect } from "react";
import { CalendarIcon, DocumentTextIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

/**
 * GUI Page Layout
 * @overview Status: Live
 */

interface GUILayoutProps {
  children: ReactNode;
}

const GUILayout: FunctionComponent<GUILayoutProps> = ({ children }) => {
  const { t } = useTranslation(["gui-opendosm-pub", "common"]);
  const { pathname, ...router } = useRouter();

  useEffect(() => {
    if (pathname === "/gui") {
      router.replace("/gui/catalogue", undefined, { shallow: true });
    }
  }, []);

  const GUI_NAVS = [
    {
      name: t("opendosm-pub"),
      url: routes.GUI.concat("/opendosm-pub"),
    },
    {
      name: t("catalogue"),
      url: routes.GUI.concat("/catalogue"),
    },
    // {
    //   name: t("opendosm-technote"),
    //   url: routes.GUI.concat("/opendosm-technote"),
    // },
    // {
    //   name: t("opendosm-arc"),
    //   url: routes.GUI.concat("/opendosm-arc"),
    // },
  ];

  const startsWith = (url: string) => {
    const path = pathname.split("/[")[0];
    return path === url;
  };

  return (
    <>
      <Hero background="blue" header={[t("header")]} description={[t("description")]} />

      {/* Navigations */}
      {/* <nav className="border-b-outline dark:border-b-washed-dark sticky top-14 z-20 flex overflow-hidden border-b bg-white dark:bg-black min-[350px]:justify-center lg:static">
        <div
          className={clx(
            "hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto sm:justify-center"
          )}
        >
          {GUI_NAVS.map(nav => (
            <div key={nav.url} className="snap-start">
              <At
                className="relative flex h-full cursor-pointer items-center justify-center px-3 outline-none"
                href={nav.url}
                scrollTop={false}
              >
                <div className="relative flex h-full flex-col items-center justify-center py-4">
                  <div
                    className={clx(
                      "flex items-center gap-2",
                      startsWith(nav.url) ? "text-black dark:text-white" : "text-dim"
                    )}
                  >
                    <span className="whitespace-nowrap text-sm font-medium">{nav.name}</span>
                    {startsWith(nav.url) && (
                      <div className="bg-primary dark:bg-primary-dark absolute bottom-0 inline-flex h-[1px] w-full rounded-full sm:hidden"></div>
                    )}
                  </div>
                </div>
                {startsWith(nav.url) && (
                  <div className="bg-primary dark:bg-primary-dark absolute bottom-0 hidden h-[2px] w-full rounded-full sm:inline-flex"></div>
                )}
              </At>
            </div>
          ))}
        </div>
      </nav> */}

      {/* Content */}
      {children}
    </>
  );
};

export default GUILayout;
