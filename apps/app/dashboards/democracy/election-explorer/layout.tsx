import At from "@components/At";
import AgencyBadge from "@components/Badge/agency";
import Hero from "@components/Hero";
import { SPRIconSolid } from "@components/Icon/agency";
import Progress from "@components/Progress";
import { FlagIcon, LightBulbIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

interface ElectionLayoutProps {
  last_updated: string;
  children: ReactNode;
}

const ElectionLayout: FunctionComponent<ElectionLayoutProps> = ({ last_updated, children }) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  const { pathname } = useRouter();

  const election_navs = [
    {
      name: t("elections"),
      icon: <SPRIconSolid />,
      url: routes.ELECTION_EXPLORER.concat("/elections"),
    },
    {
      name: t("candidates"),
      icon: <UserIcon className="m-1 h-5 w-5" />,
      url: routes.ELECTION_EXPLORER.concat("/candidates"),
    },
    {
      name: t("parties"),
      icon: <FlagIcon className="m-1 h-5 w-5" />,
      url: routes.ELECTION_EXPLORER.concat("/parties"),
    },
    {
      name: t("seats"),
      icon: <MapIcon className="m-1 h-5 w-5" />,
      url: routes.ELECTION_EXPLORER.concat("/seats"),
    },
    {
      name: "Trivia",
      icon: <LightBulbIcon className="m-1 h-5 w-5" />,
      url: routes.ELECTION_EXPLORER.concat("/trivia"),
    },
  ];

  return (
    <>
      <Progress />
      <Hero
        background="red"
        category={[t("common:categories.democracy"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="spr" />}
      />

      {/* Navigations */}
      <nav className="border-b-outline dark:border-b-washed-dark sticky top-14 z-20 flex overflow-hidden border-b bg-white dark:bg-black min-[350px]:justify-center lg:static">
        <div
          className={clx(
            "hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto",
            pathname.endsWith("/trivia") && "max-[420px]:justify-end"
          )}
        >
          {election_navs.map(nav => (
            <div className="snap-start">
              <At
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center px-3 outline-none"
                key={nav.url}
                href={nav.url}
                scrollTop={false}
              >
                <div className="relative flex h-full flex-col items-center justify-center py-4">
                  <div
                    className={clx(
                      "flex items-center gap-2",
                      pathname.startsWith(nav.url) ? "text-black dark:text-white" : "text-dim"
                    )}
                  >
                    <div className="-mx-[5px] hidden sm:block">{nav.icon}</div>
                    <span className="whitespace-nowrap text-base font-medium">{nav.name}</span>
                  </div>
                  {pathname.startsWith(nav.url) && (
                    <div className="bg-primary dark:bg-primary-dark absolute bottom-0 inline-flex h-1 w-full min-w-[56px] rounded-full"></div>
                  )}
                </div>
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

export default ElectionLayout;
