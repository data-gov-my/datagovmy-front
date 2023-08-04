import { CSSProperties, FunctionComponent, useRef } from "react";
import { Transition, Popover } from "@headlessui/react";
import { CheckCircleIcon, ChevronDownIcon, ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "next-i18next";
import { clx } from "../../lib/helpers";
import { FixedSizeList as List } from "react-window";
import Button from "../Button";

interface DaterangeProps {
  className?: string;
  disabled?: boolean;
  startYear: number;
  endYear: number;
  selectedStart?: string;
  selectedEnd?: string;
  anchor?: "left" | "right" | string;
  onChange: (selected: [string?, string?]) => void;
  onReset?: () => void;
}

const YearRange: FunctionComponent<DaterangeProps> = ({
  className,
  disabled,
  startYear,
  endYear,
  selectedStart,
  selectedEnd,
  onChange,
  onReset,
  anchor = "right",
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const startRef = useRef<List>(null);
  const endRef = useRef<List>(null);

  const YEAR_OPTIONS: Array<string> = Array(endYear - startYear + 1)
    .fill(startYear)
    .map((year, index) => `${year + index}`);

  const DateOption = ({
    type,
    year,
    index,
    selectedStart,
    selectedEnd,
    style,
  }: {
    type: "begin" | "end";
    year: string;
    index: number;
    selectedStart?: string;
    selectedEnd?: string;
    style: CSSProperties;
  }) => (
    <li
      key={`${type}_${index}`}
      style={style}
      className={clx(
        "flex select-none items-center justify-between px-4 py-1.5",
        (type === "begin" && year === selectedStart) || (type === "end" && year === selectedEnd)
          ? "bg-washed dark:bg-washed-dark"
          : "bg-inherit",
        isDisabled(type, year, type === "begin" ? selectedEnd : selectedStart)
          ? "text-outline dark:text-outlineHover-dark cursor-not-allowed hover:bg-white dark:hover:bg-black"
          : "hover:bg-washed dark:hover:bg-washed-dark cursor-pointer text-black dark:text-white"
      )}
      onClick={() => {
        if (!isDisabled(type, year, type === "begin" ? selectedEnd : selectedStart)) {
          onChange(type === "begin" ? [year, selectedEnd] : [selectedStart, year]);
        }
      }}
    >
      {year}
      {((type === "begin" && year === selectedStart) ||
        (type === "end" && year === selectedEnd)) && (
        <CheckCircleIcon className="text-primary dark:text-primary-dark h-4 w-4" />
      )}
    </li>
  );

  const isDisabled = (type: "begin" | "end", value: string, selected?: string) => {
    if (!selected) return false;
    if (type === "begin") return +value > +selected;
    return +value < +selected;
  };

  return (
    <Popover className="relative">
      {({ open }) => {
        if (open && selectedStart && selectedEnd && startRef.current && endRef.current) {
          startRef.current.scrollToItem(
            YEAR_OPTIONS.findIndex(e => e === selectedStart),
            "smart"
          );
          endRef.current.scrollToItem(
            YEAR_OPTIONS.findIndex(e => e === selectedEnd),
            "smart"
          );
        }
        return (
          <>
            <Popover.Button
              className={clx(
                "shadow-button flex items-center gap-1.5 rounded-md px-3 py-1.5 text-start text-sm font-medium text-black dark:text-white",
                "active:bg-washed hover:dark:bg-washed-dark/50 active:dark:bg-washed-dark select-none bg-white dark:bg-black",
                "border-outline dark:border-washed-dark hover:border-outlineHover hover:dark:border-outlineHover-dark border outline-none",
                disabled &&
                  "disabled:bg-outline dark:disabled:bg-washed-dark disabled:border-outline dark:disabled:border-washed-dark disabled:text-outlineHover dark:disabled:text-outlineHover-dark disabled:pointer-events-none disabled:cursor-not-allowed",
                className
              )}
              disabled={disabled}
            >
              <ClockIcon className="h-4 w-4" />
              <p className="text-sm">
                {selectedStart ?? t("begin")} - {selectedEnd ?? t("end")}
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
                      <span className="text-black dark:text-white">{selectedStart}</span>
                    </p>
                    <p className="text-dim">
                      {t("end")}: <span className="text-black dark:text-white">{selectedEnd}</span>
                    </p>
                  </div>
                  <div className="dark:border-washed-dark grid h-full grid-cols-2 overflow-auto border-b">
                    <List
                      ref={startRef}
                      height={320}
                      width={"100%"}
                      itemCount={endYear - startYear + 1}
                      itemSize={32}
                    >
                      {({ index, style }: { index: number; style: CSSProperties }) => {
                        const year = YEAR_OPTIONS[index];
                        return (
                          <DateOption
                            type="begin"
                            year={year}
                            index={index}
                            style={style}
                            selectedStart={selectedStart}
                            selectedEnd={selectedEnd}
                          />
                        );
                      }}
                    </List>
                    <List
                      ref={endRef}
                      height={320}
                      width={"100%"}
                      itemCount={endYear - startYear + 1}
                      itemSize={32}
                    >
                      {({ index, style }: { index: number; style: CSSProperties }) => {
                        const year = YEAR_OPTIONS[index];
                        return (
                          <DateOption
                            type="end"
                            year={year}
                            index={index}
                            style={style}
                            selectedStart={selectedStart}
                            selectedEnd={selectedEnd}
                          />
                        );
                      }}
                    </List>
                  </div>
                </div>
                <Button
                  className="btn text-dim w-full px-4 py-3 hover:text-black dark:hover:text-white"
                  onClick={onReset}
                  disabled={!selectedStart || !selectedEnd}
                >
                  <XMarkIcon className="h-4 w-4" />
                  {t("common:common.reset_default")}
                </Button>
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
};

export default YearRange;
