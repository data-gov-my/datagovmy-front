import Button from "@components/Button";
import { OptionType } from "@components/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";

interface ChipsProps {
  className?: string;
  colors?: string[];
  data: OptionType[];
  onRemove: (value: string) => void;
  onClearAll?: () => void;
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
    <ul className="item-center flex flex-wrap gap-1.5">
      {data.map((option: OptionType, index: number) => (
        <li
          key={option.value}
          className={
            "bg-outline dark:bg-washed-dark flex cursor-pointer flex-row items-center gap-0.5 rounded-full px-2.5 py-1 text-sm font-medium text-black outline-none transition-colors dark:text-white"
          }
          onClick={() => onRemove(option.value)}
        >
          <span>{option.label}</span>
          <XMarkIcon className="h-4 w-4 font-bold text-zinc-500" />
        </li>
      ))}
      {onClearAll && data.length && (
        <li
          className="text-dim flex cursor-pointer flex-row items-center gap-0.5 rounded-full px-2.5 py-1 text-sm font-medium outline-none transition-colors"
          onClick={onClearAll}
        >
          <span> {t("common.clear_all")}</span>
        </li>
      )}
    </ul>
  );
};

export default Chips;
