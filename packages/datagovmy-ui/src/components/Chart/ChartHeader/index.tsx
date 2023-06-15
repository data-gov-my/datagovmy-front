import { CountryAndStates } from "src/lib/constants";
import { useTranslation } from "src/hooks/useTranslation";
import { FunctionComponent, ReactNode } from "react";
import { clx } from "src/lib/helpers";
export interface ChartHeaderProps {
  className?: string;
  title?: ReactNode;
  state?: ReactNode;
  controls?: ReactNode;
  menu?: ReactNode;
}

const ChartHeader: FunctionComponent<ChartHeaderProps> = ({
  title,
  menu,
  controls,
  state,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {[title, state, controls, menu].some(Boolean) && (
        <div className={clx("flex flex-wrap items-start justify-between gap-2", className)}>
          <div>
            {title && typeof title === "string" ? (
              <span className="text-lg font-bold dark:text-white">{title}</span>
            ) : (
              title
            )}
            {state && typeof state === "string" ? (
              <p className="text-dim pt-4 text-sm">
                {t("common:common.data_for", { state: CountryAndStates[state] })}
              </p>
            ) : (
              <>{state}</>
            )}
          </div>

          {menu && <div className="block md:hidden">{menu}</div>}
          {controls && (
            <div className="flex items-center justify-end gap-2 md:hidden">{controls}</div>
          )}
          <div className="hidden items-center justify-end gap-2 md:flex">
            {controls}
            {menu && <div className="hidden md:block">{menu}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default ChartHeader;
