import At from "@components/At";
import AgencyBadge from "@components/Badge/agency";
import Hero from "@components/Hero";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

interface ElectionLayoutProps {
  children: ReactNode;
}

const ElectionLayout: FunctionComponent<ElectionLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { pathname } = useRouter();

  const election_navs = [
    {
      name: t("elections"),
      icon: <SPRIconSolid className="-mb-1" />,
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
  ];

  return (
    <div>
      <Hero
        background="red"
        category={[t("common:categories.democracy"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Election Comission (EC)"}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />

      {/* Navigations */}
      <div className="flex flex-row overflow-x-auto border-b md:justify-center">
        {election_navs.map(nav => (
          <At
            className={clx(
              "flex flex-row items-center gap-1 px-4 py-4 text-sm font-medium transition hover:cursor-pointer lg:text-base",
              pathname.startsWith(nav.url)
                ? "border-primary dark:border-primary-dark border-b-2 text-black"
                : "text-dim"
            )}
            key={nav.url}
            href={nav.url}
          >
            {nav.icon}
            {nav.name}
          </At>
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default ElectionLayout;