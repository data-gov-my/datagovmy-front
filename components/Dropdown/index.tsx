import type { OptionType } from "@components/types";
import { default as Image } from "next/image";
import { default as Label, LabelProps } from "@components/Label";
import { Fragment, ReactElement, ReactNode, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Input } from "..";
import { useTranslation } from "next-i18next";

type CommonProps<L, V> = {
  className?: string;
  disabled?: boolean;
  options: OptionType<L, V>[];
  description?: string;
  icon?: ReactNode;
  width?: string;
  label?: string;
  sublabel?: ReactNode;
  darkMode?: boolean;
  anchor?: "left" | "right" | string;
  enableSearch?: boolean;
  enableFlag?: boolean;
  enableClear?: boolean;
};

type ConditionalProps<L, V> =
  | {
      multiple?: true;
      selected?: OptionType<L, V>[];
      title: string;
      placeholder?: never;
      onChange: (selected: any) => void;
    }
  | {
      multiple?: false;
      selected?: OptionType<L, V>;
      title?: never;
      placeholder?: ReactNode;
      onChange: (selected: any) => void;
    };

type DropdownProps<L, V> = CommonProps<L, V> & ConditionalProps<L, V> & LabelProps;

const Dropdown = <L extends string | number | ReactElement | ReactElement[] = string, V = string>({
  className = "lg:flex-row ",
  disabled = false,
  multiple = false,
  icon,
  options,
  selected,
  onChange,
  enableSearch,
  title,
  description,
  anchor = "right",
  placeholder,
  width = "w-full lg:w-fit",
  label,
  sublabel,
  darkMode = false,
  enableFlag = false,
  enableClear = false,
}: DropdownProps<L, V>) => {
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();
  const isSelected = (option: OptionType<L, V>): boolean => {
    return (
      multiple &&
      option &&
      (selected as OptionType<L, V>[]).some((item: OptionType<L, V>) => item.value === option.value)
    );
  };

  const handleDeselect = (option: OptionType<L, V>): any => {
    return (selected as OptionType<L, V>[]).filter(
      (item: OptionType<L, V>) => item.value !== option.value
    );
  };
  const handleChange = (options: any) => {
    if (!multiple) return onChange(options);

    const added = options;
    if (!isSelected(added)) {
      selected && Array.isArray(selected) ? onChange([...selected, options]) : onChange([options]);
    } else {
      onChange(handleDeselect(added));
    }
  };

  const availableOptions = useMemo<OptionType<L, V>[]>(() => {
    if (!enableSearch) return options;

    return options.filter(
      option => !option.label.toString().toLowerCase().search(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <div className={["space-y-3", width].join(" ")}>
      {label && <Label label={label}></Label>}
      <Listbox
        value={selected}
        onChange={(option: OptionType<L, V> & OptionType<L, V>[]) =>
          !multiple && handleChange(option)
        }
        multiple={multiple}
        disabled={disabled}
      >
        <div className={`relative text-sm ${disabled ? "cursor-not-allowed" : ""}`}>
          <Listbox.Button
            className={[
              "relative flex gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm dark:border-washed-dark dark:bg-black lg:items-center",
              className,
              width,
              darkMode
                ? "border-outline/10 text-white active:bg-washed/10"
                : "border-outline bg-white active:bg-washed",
              ,
              disabled
                ? "pointer-events-none bg-outline text-dim"
                : "hover:border-outlineHover focus:outline-none focus-visible:ring-0",
            ].join(" ")}
          >
            <>
              {/* Icon */}
              {icon}

              {/* Sublabel */}
              {sublabel && (
                <span className="block w-fit min-w-min truncate text-dim">{sublabel}</span>
              )}

              {/* Flag (selected) */}
              {enableFlag && selected && (
                <div className="self-center">
                  <Image
                    src={`/static/images/states/${(selected as OptionType<L, V>).value}.jpeg`}
                    width={20}
                    height={12}
                    alt={(selected as OptionType<L, V>).label as string}
                  />
                </div>
              )}

              {/* Label */}
              <span className="block w-full truncate dark:text-white lg:w-auto">
                {multiple
                  ? title
                  : (selected as OptionType<L, V>)?.label || placeholder || "Select"}
              </span>
              {/* Label (multiple) */}
              {multiple && (selected as OptionType<L, V>[])?.length > 0 && (
                <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white dark:bg-primary-dark ">
                  {selected && (selected as OptionType<L, V>[]).length}
                </span>
              )}

              {/* ChevronDown Icon */}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                <ChevronDownIcon
                  className="h-5 w-5 text-black dark:text-white"
                  aria-hidden="true"
                />
              </span>
            </>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={[
                "absolute z-20 mt-1 max-h-60 min-w-full overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:ring-washed-dark",
                anchor === "right" ? "right-0" : anchor === "left" ? "left-0" : anchor,
                darkMode ? "border border-outline/10 bg-black" : "bg-white",
              ].join(" ")}
            >
              {/* Description - optional*/}
              {description && <p className="py-1 px-4 text-xs text-dim">{description}</p>}

              {/* Search - optional*/}
              {enableSearch && (
                <Input
                  type="search"
                  icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                  className="w-full min-w-[200px] border-0 border-b border-outline text-sm dark:border-washed-dark"
                  placeholder={t("common:placeholder.search") + " ..."}
                  onChange={value => setSearch(value)}
                />
              )}
              {/* Options */}
              {availableOptions.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={[
                    "relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4",
                    multiple ? "pl-10" : "pl-4",
                    darkMode
                      ? "text-white hover:bg-washed/10"
                      : "hover:bg-washed dark:text-white dark:hover:bg-washed-dark",
                    multiple &&
                    selected &&
                    Array.isArray(selected) &&
                    selected.some((item: OptionType<L, V>) => item.value == option.value)
                      ? "bg-washed dark:bg-washed-dark"
                      : "bg-inherit",
                  ].join(" ")}
                  onClick={() => (multiple ? handleChange(option) : null)}
                  value={option}
                >
                  {/* State flag - optional */}
                  <div className="flex w-full items-center justify-between gap-2">
                    {enableFlag && (
                      <Image
                        src={`/static/images/states/${option.value}.jpeg`}
                        width={20}
                        height={12}
                        alt={option.label as string}
                      />
                    )}
                    {/* Option label */}
                    <span
                      className={[
                        "block flex-grow truncate",
                        option === selected ? "font-medium" : "font-normal",
                      ].join(" ")}
                    >
                      {option.label}
                    </span>

                    {/* Checkbox (multiple mode) */}
                    {multiple && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <input
                          type="checkbox"
                          checked={
                            selected &&
                            (selected as OptionType<L, V>[]).some(
                              item => item.value === option.value
                            )
                          }
                          className="h-4 w-4 rounded border-outline text-primary focus:ring-0 dark:border-outlineHover-dark dark:bg-washed-dark dark:checked:border-primary dark:checked:bg-primary-dark"
                        />
                      </span>
                    )}

                    {/* Checkmark */}
                    {!multiple && selected && (selected as OptionType).value === option.value && (
                      <CheckCircleIcon className="h-4 w-4 text-primary dark:text-primary-dark" />
                    )}
                  </div>
                </Listbox.Option>
              ))}

              {/* Clear / Reset */}
              {enableClear && (
                <button
                  onClick={() => (multiple ? onChange([]) : onChange(undefined))}
                  className="group relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4 pl-10 text-dim hover:bg-washed disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-washed-dark"
                  disabled={Array.isArray(selected) && selected.length === 0}
                >
                  <p>{t("common.clear")}</p>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <XMarkIcon className="h-5 w-5" />
                  </span>
                </button>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
