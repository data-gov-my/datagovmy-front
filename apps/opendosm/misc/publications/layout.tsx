import { At, AgencyBadge, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";
import {
  BookOpenIcon,
  CalendarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

/**
 * Publications Layout
 * @overview Status: Live
 */

interface PublicationsLayoutProps {
  children: ReactNode;
}

const PublicationsLayout: FunctionComponent<PublicationsLayoutProps> = ({ children }) => {
  const { t } = useTranslation(["publications", "common"]);
  const { pathname } = useRouter();

  const PUBLICATION_NAVS = [
    {
      name: t("browse"),
      icon: <MagnifyingGlassIcon className="mr-1 h-5 w-5" />,
      url: routes.PUBLICATIONS,
    },
    {
      name: t("upcoming"),
      icon: <CalendarIcon className="mr-1 h-5 w-5" />,
      url: routes.PUBLICATIONS.concat("/upcoming"),
    },
    {
      name: t("technical_notes"),
      icon: <DocumentTextIcon className="mr-1 h-5 w-5" />,
      url: routes.PUBLICATIONS.concat("/technical-notes"),
    },
  ];

  const startsWith = (url: string) => {
    const path = pathname.split("/[")[0];
    return path === url;
  };

  return (
    <>
      <Hero
        background="gray"
        category={[t("nso"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="dosm" />}
      />

      {/* Navigations */}
      <nav className="sticky top-14 z-20 flex overflow-hidden border-b border-b-outline bg-white dark:border-b-washed-dark dark:bg-black min-[350px]:justify-center lg:static">
        <div
          className={clx(
            "hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto sm:justify-center"
          )}
        >
          {PUBLICATION_NAVS.map(nav => (
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
                    <div className="hidden sm:block">{nav.icon}</div>
                    <span className="whitespace-nowrap text-base font-medium">{nav.name}</span>
                    {startsWith(nav.url) && (
                      <div className="absolute bottom-0 inline-flex h-[2px] w-full rounded-full bg-primary dark:bg-primary-dark sm:hidden"></div>
                    )}
                  </div>
                </div>
                {startsWith(nav.url) && (
                  <div className="absolute bottom-0 hidden h-[2px] w-full rounded-full bg-primary dark:bg-primary-dark sm:inline-flex"></div>
                )}
              </At>
            </div>
          ))}
        </div>
      </nav>

      {/* Content */}
      {children}
    </>
  );
};

export default PublicationsLayout;
