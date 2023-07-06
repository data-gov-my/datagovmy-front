import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode } from "react";

export interface AgencyBadgeProps {
  agency: string;
  link: string;
  icon?: ReactNode;
}

const AgencyBadge: FunctionComponent<AgencyBadgeProps> = ({ agency, link, icon }) => {
  const { t } = useTranslation();
  const isGovt = agency === t("agencies:govt.full");
  return (
    <a href={link} target="_blank" referrerPolicy="strict-origin-when-cross-origin">
      <div className="border-outline hover:border-outlineHover dark:border-washed-dark dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark group relative flex w-screen items-center border-y bg-white px-3 py-1.5 transition-[padding] duration-200 hover:pr-10 dark:bg-black md:w-fit md:rounded-full md:border md:py-1 md:pl-2 md:pr-6">
        <div className="relative flex w-full items-center gap-2">
          {/* Agency icon */}
          {icon || <div className="bg-outline h-8 w-8 rounded-full" />}

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
            <p className="truncate text-sm font-medium dark:text-white" data-testid="hero_agency">
              {agency}
            </p>
          </div>
        </div>
        <ArrowUpRightIcon className="text-dim right-4.5 absolute h-4 w-4 opacity-100 transition duration-200 group-hover:translate-x-1 md:opacity-0 md:group-hover:opacity-100 " />
      </div>
    </a>
  );
};

export default AgencyBadge;
