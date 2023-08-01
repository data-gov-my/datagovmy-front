import type { OptionType } from "@components/types";
import { default as Label, LabelProps } from "@components/Label";
import { FunctionComponent, useRef } from "react";
import { Transition, Popover } from "@headlessui/react";
import { CheckCircleIcon, ChevronDownIcon, ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "next-i18next";
import { clx } from "@lib/helpers";

interface DaterangeProps extends LabelProps {
  className?: string;
  disabled?: boolean;
  beginOptions: OptionType[];
  endOptions: OptionType[];
  label?: string;
  anchor?: "left" | "right" | string;
  selected?: [OptionType?, OptionType?];
  onChange: (selected: any) => void;
  onReset?: () => void;
}

const Range: FunctionComponent<DaterangeProps> = ({
  className,
  disabled,
  beginOptions,
  endOptions,
  selected,
  onChange,
  onReset,
  anchor = "right",
  label,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const listRef = useRef<HTMLUListElement>(null);
  const beginRef = useRef<SVGSVGElement>(null);
  const endRef = useRef<SVGSVGElement>(null);

  const isDisabled = (type: "begin" | "end", value: string, selected?: string) => {
    if (!selected) return false;
    if (type === "begin") return +value > +selected;
    return +value < +selected;
  };

  return (
    <div className="space-y-2">
      {label && <Label label={label} />}
      <Popover className="relative">
        <Popover.Button
          className={clx(
            "btn-default btn-disabled shadow-button text-black dark:text-white",
            className
          )}
          disabled={disabled}
        >
          <ClockIcon className="h-4 w-4" />
          <p className="text-sm">
            {(selected && selected[0] && selected[0].label) ?? t("begin")} -{" "}
            {(selected && selected[1] && selected[1].label) ?? t("end")}
          </p>
          <ChevronDownIcon className="-mx-[5px] h-5 w-5" aria-hidden="true" />
        </Popover.Button>
        <Transition
          as={"div"}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel
            className={clx(
              "max-h-100 dark:ring-washed-dark shadow-floating absolute z-20 mt-1 min-w-full overflow-clip rounded-md bg-white text-sm ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black",
              anchor === "right" ? "right-0" : anchor === "left" ? "left-0" : anchor
            )}
          >
            <div>
              <div className="dark:border-washed-dark sticky top-0 z-20 grid w-[250px] grid-cols-2 border-b bg-white px-4 py-3 dark:bg-black">
                <p className="text-dim">
                  {t("begin")}:{" "}
                  <span className="text-black dark:text-white">
                    {selected && selected[0] && selected[0].label}
                  </span>
                </p>
                <p className="text-dim">
                  {t("end")}:{" "}
                  <span className="text-black dark:text-white">
                    {selected && selected[1] && selected[1].label}
                  </span>
                </p>
              </div>
              <div className="dark:border-washed-dark grid h-full grid-cols-2 overflow-auto border-b">
                <ul ref={listRef} className="max-h-80 overflow-auto">
                  {beginOptions.map(option => (
                    <li
                      key={option.label}
                      className={clx(
                        "flex select-none items-center justify-between px-4 py-1.5",
                        selected && selected[0]?.value === option.value
                          ? "bg-washed dark:bg-washed-dark"
                          : "bg-inherit",
                        selected && isDisabled("begin", option.value, selected[1]?.value)
                          ? "text-outline dark:text-outlineHover-dark cursor-not-allowed hover:bg-white dark:hover:bg-black"
                          : "hover:bg-washed dark:hover:bg-washed-dark cursor-pointer text-black dark:text-white"
                      )}
                      onClick={() => {
                        if (selected && !isDisabled("begin", option.value, selected[1]?.value))
                          onChange([option, selected ? selected[1] : undefined]);
                      }}
                    >
                      {option.label}
                      {selected && selected[0]?.value === option.value && (
                        <CheckCircleIcon
                          ref={beginRef}
                          className="text-primary dark:text-primary-dark h-4 w-4"
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <ul className="max-h-80 overflow-auto">
                  {endOptions.map(option => (
                    <li
                      key={option.label}
                      className={clx(
                        "flex select-none items-center justify-between px-4 py-1.5",
                        selected && selected[1]?.value === option.value
                          ? "bg-washed dark:bg-washed-dark"
                          : "bg-inherit",
                        selected && isDisabled("end", option.value, selected[0]?.value)
                          ? "text-outline dark:text-outlineHover-dark cursor-not-allowed hover:bg-white dark:hover:bg-black"
                          : "hover:bg-washed dark:hover:bg-washed-dark cursor-pointer text-black dark:text-white"
                      )}
                      onClick={() => {
                        if (selected && !isDisabled("end", option.value, selected[0]?.value))
                          onChange([selected ? selected[0] : undefined, option]);
                      }}
                    >
                      {option.label}
                      {selected && selected[1]?.value === option.value && (
                        <CheckCircleIcon
                          ref={endRef}
                          className="text-primary dark:text-primary-dark h-4 w-4"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="btn text-dim px-4 py-3 hover:text-black dark:hover:text-white"
              onClick={onReset}
              disabled={selected?.every(item => item === undefined)}
            >
              <XMarkIcon className="h-4 w-4" />
              {t("common:common.reset_default")}
            </button>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};

export default Range;
