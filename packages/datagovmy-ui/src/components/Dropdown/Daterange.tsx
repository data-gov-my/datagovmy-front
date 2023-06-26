import type { OptionType } from "../types";
import { default as Label, LabelProps } from "../Label";
import { FunctionComponent, useRef } from "react";
import { Transition, Popover } from "@headlessui/react";
import { CheckCircleIcon, ChevronDownIcon, ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "..";
import { useTranslation } from "next-i18next";

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
  className = "relative lg:w-fit flex gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm",
  disabled = false,
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
        {({ open }) => {
          open &&
            beginRef.current &&
            beginRef.current.scrollIntoView({ behavior: "auto", block: "center" });
          open &&
            endRef.current &&
            endRef.current.scrollIntoView({ behavior: "auto", block: "center" });
          return (
            <>
              <Popover.Button
                className={[
                  "dark:border-washed-dark relative flex w-full flex-row items-start gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm dark:bg-black lg:w-fit lg:items-center",
                  className,
                  disabled
                    ? "bg-outline text-dim pointer-events-none"
                    : "hover:border-outlineHover focus:outline-none focus-visible:ring-0",
                ].join(" ")}
              >
                <ClockIcon className="h-4 w-4 text-black dark:text-white" />
                <p className="text-sm">
                  {(selected && selected[0] && selected[0].label) ?? t("begin")} -{" "}
                  {(selected && selected[1] && selected[1].label) ?? t("end")}
                </p>

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                  <ChevronDownIcon
                    className="h-5 w-5 text-black dark:text-white"
                    aria-hidden="true"
                  />
                </span>
              </Popover.Button>
              <Transition
                as={"div"}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Panel
                  className={[
                    "max-h-100 dark:ring-washed-dark absolute z-20 mt-1 min-w-full overflow-clip rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black",
                    anchor === "right" ? "right-0" : anchor === "left" ? "left-0" : anchor,
                  ].join(" ")}
                >
                  <div className="relative">
                    <div className="dark:border-washed-dark sticky top-0 z-20 grid w-[250px] grid-cols-2 border-b bg-white px-4 py-3 dark:bg-black">
                      <p className="text-dim whitespace-nowrap">
                        {t("begin")}:{" "}
                        <span className="text-black dark:text-white">
                          {selected && selected[0] && selected[0].label}
                        </span>
                      </p>
                      <p className="text-dim whitespace-nowrap">
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
                            className={[
                              "flex select-none items-center justify-between px-4 py-2",
                              selected && selected[0]?.value === option.value
                                ? "bg-washed dark:bg-washed-dark"
                                : "bg-inherit",
                              selected && isDisabled("begin", option.value, selected[1]?.value)
                                ? "text-outline dark:text-outlineHover-dark cursor-not-allowed hover:bg-white dark:hover:bg-black"
                                : "hover:bg-washed dark:hover:bg-washed-dark cursor-pointer",
                            ].join(" ")}
                            onClick={() => {
                              if (
                                selected &&
                                !isDisabled("begin", option.value, selected[1]?.value)
                              )
                                onChange([option, selected ? selected[1] : undefined]);
                            }}
                          >
                            {option.label}
                            {selected && selected[0]?.value === option.value && (
                              <CheckCircleIcon
                                ref={beginRef}
                                className="text-primary dark:text-primary-dark h-5 w-5"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                      <ul className="max-h-80 overflow-auto">
                        {endOptions.map(option => (
                          <li
                            key={option.label}
                            className={[
                              "flex select-none items-center justify-between px-4 py-2",
                              selected && selected[1]?.value === option.value
                                ? "bg-washed dark:bg-washed-dark"
                                : "bg-inherit",
                              selected && isDisabled("end", option.value, selected[0]?.value)
                                ? "text-outline dark:text-outlineHover-dark cursor-not-allowed hover:bg-white dark:hover:bg-black"
                                : "hover:bg-washed dark:hover:bg-washed-dark cursor-pointer",
                            ].join(" ")}
                            onClick={() => {
                              if (selected && !isDisabled("end", option.value, selected[0]?.value))
                                onChange([selected ? selected[0] : undefined, option]);
                            }}
                          >
                            {option.label}
                            {selected && selected[1]?.value === option.value && (
                              <CheckCircleIcon
                                ref={endRef}
                                className="text-primary dark:text-primary-dark h-5 w-5"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button
                    className="text-dim px-4 py-3 transition hover:text-black dark:hover:text-white"
                    icon={<XMarkIcon className="h-4 w-4" />}
                    onClick={onReset}
                    disabled={selected?.every(item => item === undefined)}
                  >
                    {t("common:common.reset_default")}
                  </Button>
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </div>
  );
};

export default Range;
