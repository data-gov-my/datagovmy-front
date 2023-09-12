import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "datagovmy-ui/hooks";
import { Button } from "datagovmy-ui/components";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { clx } from "datagovmy-ui/helpers";
import { FunctionComponent, MouseEventHandler, useContext, useMemo } from "react";

/**
 * Election Explorer - Filter
 * @overview Status: In-development
 */

interface ElectionFilterProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

const ElectionFilter: FunctionComponent<ElectionFilterProps> = ({ onClick }) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  const { scroll } = useContext(WindowContext);
  const show = useMemo(() => scroll.y > 500, [scroll.y]);

  return (
    <div className={clx(show ? "fixed right-3 top-[120px] z-20 sm:top-32 lg:hidden" : "hidden")}>
      <Button onClick={onClick} className="btn-default shadow-floating">
        <span>{t("filter")}</span>
        <span className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
          3
        </span>
        <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
      </Button>
    </div>
  );
};

export default ElectionFilter;
