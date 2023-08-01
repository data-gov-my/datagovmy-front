import { clx } from "../lib/helpers";
import { FunctionComponent, ReactNode } from "react";

export interface ChartHeaderProps {
  className?: string;
  title?: ReactNode;
  controls?: ReactNode;
  menu?: ReactNode;
}

const ChartHeader: FunctionComponent<ChartHeaderProps> = ({ title, menu, controls, className }) => {
  return (
    <>
      {[title, controls, menu].some(Boolean) && (
        <div className={clx("flex flex-wrap items-start justify-between gap-2", className)}>
          {title && typeof title === "string" ? <h5>{title}</h5> : title}
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
