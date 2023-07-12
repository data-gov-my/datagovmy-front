import AgencyBadge from "@components/Badge/agency";
import Hero from "@components/Hero";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import Progress from "@components/Progress";
import { FlagIcon, LightBulbIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";

import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";
import At from "@components/At";

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
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:spr.full")}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />

      {/* Navigations */}
      <div
        className={clx(
          "border-b-outline dark:border-b-washed-dark hide-scrollbar sticky top-14 z-20 flex flex-row gap-2 overflow-x-auto border-b bg-white px-3 dark:bg-black sm:justify-center md:pl-0 lg:static",
          pathname.endsWith("/trivia") ? "max-sm:justify-end" : "max-sm:justify-start"
        )}
      >
        {election_navs.map(nav => (
          <At
            className={clx(
              "flex flex-row items-center gap-1 whitespace-nowrap px-2 py-3 text-center text-base font-medium transition lg:p-4",
              pathname.startsWith(nav.url)
                ? "border-primary dark:border-primary-dark border-b-2 text-black dark:text-white"
                : "text-dim"
            )}
            key={nav.url}
            href={nav.url}
            scrollTop={false}
          >
            <div className="hidden sm:block">{nav.icon}</div>
            {nav.name}
          </At>
        ))}
      </div>

      {/* Content */}
      {children}
    </>
  );
};

export default ElectionLayout;
