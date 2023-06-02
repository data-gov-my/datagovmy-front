import type { OptionType } from "@components/types";
import { default as Image } from "next/image";
import { default as Label, LabelProps } from "@components/Label";
import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
  useRef,
  CSSProperties,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Input from "@components/Input";
import { useTranslation } from "next-i18next";
import { clx } from "@lib/helpers";
import { FixedSizeList } from "react-window";
import { matchSorter } from "match-sorter";

type CommonProps = {
  className?: string;
  disabled?: boolean;
  options: OptionType[];
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
  virtualise?: boolean;
};

type ConditionalProps =
  | {
      multiple?: true;
      selected?: OptionType[];
      title: string;
      placeholder?: never;
      onChange: (selected: any) => void;
    }
  | {
      multiple?: false;
      selected?: OptionType;
      title?: never;
      placeholder?: ReactNode;
      onChange: (selected: any) => void;
    };

type DropdownProps = CommonProps & ConditionalProps & LabelProps;

const Dropdown: FunctionComponent<DropdownProps> = ({
  className = "lg:flex-row",
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
  virtualise = false,
}) => {
  const [search, setSearch] = useState<string>("");
  const optionsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isSelected = (option: OptionType): boolean => {
    return (
      multiple &&
      option &&
      (selected as OptionType[]).some((item: OptionType) => item.value === option.value)
    );
  };

  const handleDeselect = (option: OptionType): any => {
    return (selected as OptionType[]).filter((item: OptionType) => item.value !== option.value);
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

  const availableOptions = useMemo<OptionType[]>(() => {
    if (!enableSearch) return options;

    return matchSorter(options, search.toLowerCase(), { keys: ["label"] });
  }, [options, search]);

  const ListboxOption = ({
    option,
    index,
    style,
  }: {
    option: OptionType;
    index: number;
    style: any;
  }) => (
    <Listbox.Option
      key={index}
      style={style}
      className={clx(
        "relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4",
        multiple ? "pl-10" : "pl-4",
        darkMode
          ? "hover:bg-washed/10 text-white"
          : "hover:bg-washed dark:hover:bg-washed-dark dark:text-white",
        multiple &&
          selected &&
          Array.isArray(selected) &&
          selected.some((item: OptionType) => item.value == option.value)
          ? "bg-washed dark:bg-washed-dark"
          : "bg-inherit"
      )}
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
                selected && (selected as OptionType[]).some(item => item.value === option.value)
              }
              className="border-outline text-primary dark:border-outlineHover-dark dark:bg-washed-dark dark:checked:border-primary dark:checked:bg-primary-dark h-4 w-4 rounded focus:ring-0"
            />
          </span>
        )}

        {/* Checkmark */}
        {!multiple && selected && (selected as OptionType).value === option.value && (
          <CheckCircleIcon className="text-primary dark:text-primary-dark h-4 w-4" />
        )}
      </div>
    </Listbox.Option>
  );

  return (
    <div className={clx("space-y-3", width)}>
      {label && <Label label={label}></Label>}
      <Listbox
        value={selected}
        onChange={(option: OptionType & OptionType[]) => !multiple && handleChange(option)}
        multiple={multiple}
        disabled={disabled}
      >
        <div className={`relative text-sm ${disabled ? "cursor-not-allowed" : ""}`}>
          <Listbox.Button
            className={clx(
              "dark:border-washed-dark relative flex gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm dark:bg-black lg:items-center",
              className,
              width,
              darkMode
                ? "border-outline/10 active:bg-washed/10 bg-black"
                : "border-outline active:bg-washed bg-white",
              disabled
                ? "bg-outline text-dim pointer-events-none"
                : "hover:border-outlineHover focus:outline-none focus-visible:ring-0"
            )}
          >
            <>
              {/* Icon */}
              {icon}

              {/* Sublabel */}
              {sublabel && (
                <span className="text-dim block w-fit min-w-min truncate">{sublabel}</span>
              )}

              {/* Flag (selected) */}
              {enableFlag && selected && (
                <div className="self-center">
                  <Image
                    src={`/static/images/states/${(selected as OptionType).value}.jpeg`}
                    width={20}
                    height={12}
                    alt={(selected as OptionType).label as string}
                  />
                </div>
              )}

              {/* Label */}
              <span
                className={clx(
                  disabled ? "dark:text-dim" : "dark:text-white",
                  "block w-full truncate lg:w-auto"
                )}
              >
                {multiple ? title : (selected as OptionType)?.label || placeholder || "Select"}
              </span>
              {/* Label (multiple) */}
              {multiple && (selected as OptionType[])?.length > 0 && (
                <span className="dark:bg-primary-dark rounded-md bg-black px-1 py-0.5 text-xs text-white ">
                  {selected && (selected as OptionType[]).length}
                </span>
              )}

              {/* ChevronDown Icon */}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                <ChevronDownIcon
                  className={clx(
                    disabled ? "dark:text-dim" : "dark:text-white",
                    "h-5 w-5 text-black"
                  )}
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
              ref={optionsRef}
              className={clx(
                "dark:ring-washed-dark absolute z-20 mt-1 min-w-full rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black",
                anchor === "right" ? "right-0" : anchor === "left" ? "left-0" : anchor,
                darkMode ? "border-outline/10 border bg-black" : "bg-white"
              )}
            >
              {/* Description - optional*/}
              {description && <p className="text-dim px-3 pb-1 pt-2 text-xs">{description}</p>}

              {/* Search - optional*/}
              {enableSearch && (
                <Input
                  type="search"
                  icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                  value={search}
                  className="border-outline dark:border-washed-dark w-full rounded-b-none border-0 border-b text-sm"
                  placeholder={t("common:placeholder.search") + " ..."}
                  onChange={value => setSearch(value)}
                />
              )}
              {/* Options */}
              {virtualise ? (
                <FixedSizeList
                  height={240}
                  width={"100%"}
                  itemCount={availableOptions.length}
                  itemSize={35}
                >
                  {({ index, style }: { index: number; style: CSSProperties }) => {
                    const option = availableOptions[index];
                    return <ListboxOption option={option} index={index} style={style} />;
                  }}
                </FixedSizeList>
              ) : (
                <div className="max-h-60 overflow-auto">
                  {availableOptions.map((option, index) => (
                    <ListboxOption key={index} option={option} index={index} style={null} />
                  ))}
                </div>
              )}

              {/* Clear / Reset */}
              {enableClear && (
                <button
                  onClick={() => (multiple ? onChange([]) : onChange(undefined))}
                  className="text-dim hover:bg-washed dark:hover:bg-washed-dark group relative flex w-full cursor-default select-none items-center gap-2 border-t py-2 pl-10 pr-4 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={Array.isArray(selected) && selected.length === 0}
                >
                  <p>{t("common:common.clear")}</p>
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
