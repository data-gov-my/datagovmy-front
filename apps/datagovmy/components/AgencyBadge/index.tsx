import At from "@components/At";
import Card from "@components/Card";
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
  return (
    <a href={link} target="_blank">
      <Card className="border-outline hover:border-outlineHover dark:border-washed-dark dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark group -mx-3 flex w-screen items-center border-y bg-white px-3 py-1.5 transition-[padding] duration-200 hover:pr-10 dark:bg-black md:m-0 md:w-fit md:rounded-full md:border md:py-1 md:pl-2 md:pr-6">
        <div className="relative flex w-full items-center gap-2">
          {/* Agency icon */}
          {icon || <div className="bg-outline h-8 w-8 rounded-full" />}

          {/* On hover: RightArrow icon */}
          <ArrowUpRightIcon className="text-dim absolute right-0 h-4 w-4 opacity-100 transition duration-200 group-hover:translate-x-1 md:opacity-0 md:group-hover:opacity-100 lg:-right-6" />
          <div className="relative overflow-hidden">
            {/* Brought to you by / Visit our portal */}
            <p className="text-dim text-xs transition-transform duration-200 group-hover:-translate-y-6">
              {t("components.brought_by")}
            </p>
            <p className="text-primary dark:text-primary-dark absolute -top-6 text-xs transition-transform group-hover:translate-y-6">
              {t("components.visit_portal")}
            </p>

            {/* Agency name */}
            <p className="truncate text-sm font-medium dark:text-white">{agency}</p>
          </div>
        </div>
      </Card>
    </a>
  );
};

export default AgencyBadge;
