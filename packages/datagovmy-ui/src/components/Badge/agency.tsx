import AgencyIcon from "../../icons/agency";
import { AgencyLink } from "../../lib/constants";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode } from "react";
import { Agency } from "../../../types";
import { clx } from "../../lib/helpers";

type AgencyBadge = {
  agency: Agency;
  name?: never;
  url?: never;
  prefix?: never;
};

type ConditionalBadgeProps = AgencyBadge | (BaseBadgeProps & { url?: string });

export type AgencyBadgeProps = ConditionalBadgeProps & {
  icon?: ReactNode;
};

const AgencyBadge: FunctionComponent<AgencyBadgeProps> = ({ agency, icon, name, prefix, url }) => {
  const { t } = useTranslation();

  const wrap = (children: ReactNode, _url?: string) =>
    _url ? (
      <a href={_url} target="_blank" referrerPolicy="strict-origin-when-cross-origin">
        {children}
      </a>
    ) : (
      children
    );

  if (agency)
    return wrap(
      <BaseBadge
        name={t(`agencies:${agency}.full`)}
        icon={icon ? icon : <AgencyIcon agency={agency} />}
        prefix={agency === "govt"}
        external
      />,
      AgencyLink[agency]
    );

  return wrap(<BaseBadge name={name} icon={icon} prefix={prefix} />, url);
};

interface BaseBadgeProps {
  name: string;
  agency?: never;
  icon?: ReactNode;
  prefix?: boolean;
  external?: boolean;
}

const BaseBadge: FunctionComponent<BaseBadgeProps> = ({ external, name, icon, prefix }) => {
  const { t } = useTranslation();
  return (
    <div
      className={clx(
        "border-outline dark:border-washed-dark group relative flex w-screen items-center border-y bg-white px-3 py-1.5 dark:bg-black lg:w-fit lg:rounded-full lg:border lg:py-1 lg:pl-2 lg:pr-6",
        external &&
          "lg:dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark lg:hover:border-outlineHover transition-[padding] duration-200 hover:pr-10"
      )}
    >
      <div className="relative flex w-full items-center gap-2 max-lg:pr-6">
        {/* Agency icon */}
        {icon}

        <div className="relative overflow-hidden">
          {/* Brought to you by */}
          <p
            className={clx(
              "text-dim text-xs",
              external && "transition-transform duration-200 group-hover:-translate-y-6"
            )}
          >
            {!prefix ? t("common:components.brought_by") : t("common:components.brought_by_the")}
          </p>
          {/* Visit our portal */}
          {external && (
            <p className="text-primary dark:text-primary-dark absolute -top-6 text-xs transition-transform group-hover:translate-y-6">
              {t("common:components.visit_portal")}
            </p>
          )}
          {/* Agency name */}
          <p className="truncate text-sm font-medium dark:text-white" data-testid="hero-agency">
            {name}
          </p>
        </div>
      </div>
      {/* On hover: RightArrow icon */}
      {external && (
        <ArrowUpRightIcon className="text-dim right-4.5 absolute h-4 w-4 opacity-100 transition duration-200 group-hover:translate-x-1 lg:opacity-0 lg:group-hover:opacity-100 " />
      )}
    </div>
  );
};

export default AgencyBadge;
