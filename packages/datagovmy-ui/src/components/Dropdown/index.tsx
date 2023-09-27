import Input from "../Input";
import { default as Label, LabelProps } from "../Label";
import type { OptionType } from "../../../types";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { clx } from "../../lib/helpers";
import { matchSorter } from "match-sorter";
import { useTranslation } from "next-i18next";
import { default as Image } from "next/image";
import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
  useRef,
  CSSProperties,
} from "react";
import { FixedSizeList } from "react-window";

type CommonProps = {
  className?: string;
  disabled?: boolean;
  options: OptionType[];
  description?: string;
  icon?: ReactNode;
  width?: string;
  label?: string;
  sublabel?: ReactNode;
  anchor?: "left" | "right" | string;
  enableSearch?: boolean;
  enableFlag?: boolean;
  enableClear?: boolean;
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
  className = "",
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
  enableFlag = false,
  enableClear = false,
}) => {
  const [search, setSearch] = useState<string>("");
  const optionsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isSelected = (option: OptionType): boolean => {
    return (
      multiple && (selected as OptionType[]).some((item: OptionType) => item.value === option.value)
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
      className={({ active }) =>
        clx(
          "relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4",
          multiple ? "pl-10" : "pl-4",
          active && "bg-washed dark:bg-washed-dark"
        )
      }
      onClick={() => (multiple ? handleChange(option) : null)}
      value={option}
    >
      {/* State flag - optional */}
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
        className={clx(
          "block flex-grow truncate",
          option === selected ? "font-medium" : "font-normal"
        )}
      >
        {option.label}
      </span>

      {/* Checkbox (multiple mode) */}
      {multiple && (
        <span className="absolute inset-y-0 left-3 flex items-center">
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
        <div className="relative text-sm">
          <Listbox.Button
            className={clx(
              "shadow-button flex items-center gap-1.5 rounded-md px-3 py-1.5",
              "text-start text-sm font-medium text-black dark:text-white",
              "active:bg-washed hover:dark:bg-washed-dark/50 active:dark:bg-washed-dark select-none bg-white dark:bg-black",
              "border-outline dark:border-washed-dark hover:border-outlineHover hover:dark:border-outlineHover-dark border outline-none",
              disabled &&
                "disabled:bg-outline dark:disabled:bg-washed-dark disabled:border-outline dark:disabled:border-washed-dark disabled:text-outlineHover dark:disabled:text-outlineHover-dark disabled:pointer-events-none disabled:cursor-not-allowed",
              width,
              className
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
              <span className="flex flex-grow truncate">
                {multiple ? title : (selected as OptionType)?.label || placeholder || "Select"}
              </span>
              {/* Label (multiple) */}
              {multiple && (selected as OptionType[])?.length > 0 && (
                <span className="dark:bg-primary-dark bg-primary w-4.5 h-5 rounded-md text-center text-white">
                  {selected && (selected as OptionType[]).length}
                </span>
              )}

              {/* ChevronDown Icon */}
              <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
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
                "dark:ring-washed-dark shadow-floating absolute z-20 mt-1 rounded-md bg-white text-black ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-white",
                availableOptions.length <= 160 && "max-h-60 overflow-auto",
                width ? width : "",
                anchor === "right" ? "right-0" : anchor === "left" ? "left-0" : anchor
              )}
            >
              {/* Description - optional*/}
              {description && <p className="text-dim px-3 pb-1 pt-2 text-xs">{description}</p>}

              {/* Search - optional*/}
              {enableSearch && (
                <div className="dark:border-outlineHover-dark border-b pt-1">
                  <Input
                    type="search"
                    icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                    value={search}
                    className="border-none focus:ring-transparent"
                    placeholder={t("common:placeholder.search") + "..."}
                    onChange={value => setSearch(value)}
                  />
                </div>
              )}
              {/* Options */}
              {availableOptions.length > 160 ? (
                <FixedSizeList
                  height={240}
                  width={"100%"}
                  itemCount={availableOptions.length}
                  itemSize={36}
                >
                  {({ index, style }: { index: number; style: CSSProperties }) => {
                    const option = availableOptions[index];
                    return <ListboxOption option={option} index={index} style={style} />;
                  }}
                </FixedSizeList>
              ) : (
                <>
                  {availableOptions.map((option, index) => (
                    <ListboxOption key={index} option={option} index={index} style={null} />
                  ))}
                </>
              )}

              {/* Clear / Reset */}
              {enableClear && (
                <button
                  onClick={() => (multiple ? onChange([]) : onChange(undefined))}
                  className="text-dim hover:bg-washed dark:hover:bg-washed-dark dark:border-washed-dark group relative flex w-full cursor-default select-none items-center gap-2 border-t py-3 pl-10 pr-4 disabled:cursor-not-allowed disabled:opacity-50"
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
