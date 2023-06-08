import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode } from "react";
export interface ChartHeaderProps {
  className?: string;
  title?: string | ReactNode;
  state?: string | ReactNode;
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
      <div className={`flex flex-wrap items-start justify-between gap-2 ${className}`}>
        <div>
          {title && typeof title === "string" ? (
            <span className="text-base font-bold">{title}</span>
          ) : (
            title
          )}
          {state && typeof state === "string" ? (
            <p className="pt-4 text-sm text-dim">
              {t("common.data_for", { state: CountryAndStates[state] })}
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
    </>
  );
};

export default ChartHeader;
