import AgencyIcon from "@components/Icon/agency";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { AgencyLink } from "@lib/constants";
import { Agency } from "@lib/types";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode } from "react";

export interface AgencyBadgeProps {
  agency: Agency;
  icon?: ReactNode;
}

const AgencyBadge: FunctionComponent<AgencyBadgeProps> = ({ agency, icon }) => {
  const { t } = useTranslation();
  const isGovt = agency === "GOVT";
  return (
    <a href={AgencyLink[agency]} target="_blank" referrerPolicy="strict-origin-when-cross-origin">
      <div className="border-outline lg:hover:border-outlineHover dark:border-washed-dark lg:dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark group relative flex w-screen items-center border-y bg-white px-3 py-1.5 transition-[padding] duration-200 hover:pr-10 dark:bg-black lg:w-fit lg:rounded-full lg:border lg:py-1 lg:pl-2 lg:pr-6">
        <div className="relative flex w-full items-center gap-2 max-lg:pr-6">
          {/* Agency icon */}
          {icon ? icon : <AgencyIcon agency={agency} />}

          {/* On hover: RightArrow icon */}
          <div className="relative overflow-hidden">
            {/* Brought to you by / Visit our portal */}
            <p className="text-dim text-xs transition-transform duration-200 group-hover:-translate-y-6">
              {!isGovt ? t("common:components.brought_by") : t("common:components.brought_by_the")}
            </p>
            <p className="text-primary dark:text-primary-dark absolute -top-6 text-xs transition-transform group-hover:translate-y-6">
              {t("common:components.visit_portal")}
            </p>

            {/* Agency name */}
            <p className="truncate text-sm font-medium dark:text-white" data-testid="hero-agency">
              {t(`agencies:${String(agency).toLowerCase()}.full`)}
            </p>
          </div>
        </div>
        <ArrowUpRightIcon className="text-dim right-4.5 absolute h-4 w-4 opacity-100 transition duration-200 group-hover:translate-x-1 lg:opacity-0 lg:group-hover:opacity-100 " />
      </div>
    </a>
  );
};

export default AgencyBadge;
