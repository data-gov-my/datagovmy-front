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
    <div className={["flex flex-wrap gap-2", className].join(" ")}>
      {data.map((item: OptionType, index: number) => {
        return (
          <Button
            key={item.value}
            className="border bg-washed py-1 px-2 text-start text-sm font-medium leading-6"
            icon={<XMarkIcon className="h-4 w-4" onClick={() => onRemove(item.value)} />}
          >
            <>
              <span className="block">{item.label}</span>
              {colors && (
                <div
                  className="min-h-[8px] min-w-[8px] rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
              )}
            </>
          </Button>
        );
      })}
      {onClearAll && data.length ? (
        <Button icon={<XMarkIcon className="h-4 w-4" />} onClick={onClearAll}>
          {t("common.clear_all")}
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chips;
