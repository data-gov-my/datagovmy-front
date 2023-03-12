import At from "@components/At";
import Card from "@components/Card";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { FunctionComponent, ReactNode } from "react";

interface AgencyBadgeProps {
  agency: string;
  link: string;
  icon: ReactNode;
  disabled: boolean;
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
        className="group flex h-12 w-[186px] items-center overflow-hidden rounded-3xl 
      bg-white transition-[width] duration-75 hover:w-[214px] hover:border-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <div className="relative flex items-center gap-2 pl-2">
          {icon}

          <ArrowUpRightIcon className="absolute -right-6 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />

          <div className="relative overflow-hidden">
            <p className=" text-xs text-dim transition-transform group-hover:-translate-y-6">
              Brought to you by
            </p>
            <p className="absolute -top-6 text-xs text-primary transition-transform group-hover:translate-y-6">
              Visit our portal
            </p>
            <p className="truncate text-sm dark:text-white">{agency}</p>
          </div>
        </div>
      </Card>
    </At>
  );
};

export default AgencyBadge;
