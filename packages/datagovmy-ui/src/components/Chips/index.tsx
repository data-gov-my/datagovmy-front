import { useTranslation } from "../../hooks/useTranslation";
import { clx } from "../../lib/helpers";
import { OptionType } from "../../../types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunctionComponent } from "react";
import Button from "../Button";

interface ChipsProps {
  className?: string;
  colors?: string[];
  data: OptionType[];
  onRemove: null | ((value: string) => void);
  onClearAll?: null | (() => void);
}

const Chips: FunctionComponent<ChipsProps> = ({
  className,
  data,
  colors,
  onRemove,
  onClearAll,
}) => {
  const { t } = useTranslation();

  return (
    <ul className={clx("item-center flex flex-wrap gap-1.5", className)}>
      {data.map((option: OptionType, index: number) => (
        <li
          key={option.value}
          className="bg-outline dark:bg-washed-dark flex cursor-pointer flex-row items-center gap-1.5 truncate rounded-full px-3 py-1 text-sm font-medium text-black outline-none transition-colors dark:text-white"
          onClick={() => onRemove && onRemove(option.value)}
        >
          {colors && (
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index] }} />
          )}
          <span className="truncate">{option.label}</span>
          {onRemove !== null && (
            <XMarkIcon className="text-dim h-4 w-4 font-bold hover:text-black dark:hover:text-white" />
          )}
        </li>
      ))}
      {data.length > 0 && onClearAll !== null && (
        <Button
          className="text-dim px-3 py-1.5 hover:text-black dark:hover:text-white"
          onClick={onClearAll}
        >
          {t("common:common.clear_all")}
        </Button>
      )}
    </ul>
  );
};

export default Chips;
