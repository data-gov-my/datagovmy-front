import At from "@components/At";
import Card from "@components/Card";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { FunctionComponent, ReactNode } from "react";

export interface AgencyBadgeProps {
  agency: string;
  link: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const AgencyBadge: FunctionComponent<AgencyBadgeProps> = ({
  agency,
  link,
  icon,
  disabled = false,
}) => {
  return (
    <At href={link} key={link}>
      <Card
        className="group flex h-12 min-w-[186px] max-w-fit items-center overflow-hidden rounded-3xl 
      bg-white transition-all duration-75 hover:min-w-[214px] hover:border-slate-400 hover:pr-5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <div className="relative flex items-center gap-2 pl-2">
          {icon || <div className="h-8 w-8 rounded-full bg-outline" />}

          <div className="relative overflow-hidden">
            <p className=" text-xs text-dim transition-transform group-hover:-translate-y-6">
              Brought to you by
            </p>
            <p className="absolute -top-6 text-xs text-primary transition-transform group-hover:translate-y-6">
              Visit our portal
            </p>
            <p className="mr-4 truncate text-sm dark:text-white">{agency}</p>
          </div>

          <ArrowUpRightIcon className="h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </div>
      </Card>
    </At>
  );
};

export default AgencyBadge;
