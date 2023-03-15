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
    <At href={link}>
      <Card className="group flex w-fit items-center rounded-full border border-outline bg-white py-1 pl-2 pr-6 transition-[padding] duration-200 hover:border-outlineHover hover:pr-10 dark:border-outlineHover-dark dark:bg-black dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark">
        <div className="relative flex items-center gap-2 ">
          {/* Agency icon */}
          {icon || <div className="h-8 w-8 rounded-full bg-outline" />}

          {/* On hover: RightArrow icon */}
          <ArrowUpRightIcon className="absolute -right-6 h-4 w-4 text-dim opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100" />

          <div className="relative overflow-hidden">
            {/* Brought to you by / Visit our portal */}
            <p className="text-xs text-dim transition-transform duration-200 group-hover:-translate-y-6">
              {t("components.brought_by")}
            </p>
            <p className="absolute -top-6 text-xs text-primary transition-transform group-hover:translate-y-6 dark:text-primary-dark">
              {t("components.visit_portal")}
            </p>

            {/* Agency name */}
            <p className="truncate text-sm font-medium dark:text-white">{agency}</p>
          </div>
        </div>
      </Card>
    </At>
  );
};

export default AgencyBadge;
