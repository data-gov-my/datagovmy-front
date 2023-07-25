import Image from "next/image";
import { Fragment, ReactElement } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { isObjInArr } from "lib/helpers";

import { OptionType } from "@components/types";

type CommonProps<L, V> = {
  disabled?: boolean;
  multiple?: boolean;
  options: OptionType<L, V>[];
  description?: string;
  onChange: (selected: OptionType<L, V>) => void;
  width?: string;
  enableFlag?: boolean;
  label?: string;
};

type ConditionalProps<L, V> =
  | {
      multiple?: true;
      selected?: OptionType<L, V>[];
      title: string;
      placeholder?: never;
      clearSelected: () => void;
    }
  | {
      multiple?: false;
      selected?: OptionType<L, V>;
      title?: never;
      placeholder?: string;
      clearSelected?: never;
    };

type DropdownProps<L, V> = CommonProps<L, V> & ConditionalProps<L, V>;

const Dropdown = <L extends string | number | ReactElement = string, V = string>({
  disabled = false,
  multiple = false,
  options,
  selected,
  onChange,
  clearSelected,
  title,
  description,
  placeholder,
  width = "w-fit",
  enableFlag = false,
  label,
}: DropdownProps<L, V>) => {
  return (
    <Listbox
      value={selected}
      onChange={(option: OptionType<L, V>) => (multiple ? null : onChange(option))}
      multiple={multiple}
      disabled={disabled}
    >
      <div className={`relative text-sm ${disabled ? "cursor-not-allowed" : ""}`}>
        <Listbox.Button
          className={`
            relative flex w-full items-center gap-[6px] rounded-md border border-outline bg-white py-[6px] pl-3 pr-8 text-left shadow-sm 
            ${
              disabled
                ? "pointer-events-none bg-outline text-dim"
                : "hover:border-outlineHover focus:bg-washed focus:outline-none focus-visible:ring-0"
            }
            ${width}
          `}
        >
          {label && <span className="text-dim">{label}:</span>}
          {enableFlag && selected && (
            <Image
              src={`/static/images/states/${(selected as OptionType<L, V>).value}.jpeg`}
              width={20}
              height={12}
              alt={(selected as OptionType<L, V>).label as string}
            />
          )}
          <span className={`block truncate ${label ? "" : ""}`}>
            {multiple ? title : (selected as OptionType<L, V>)?.label || placeholder || "Select"}
          </span>
          {/* NUMBER OF OPTIONS SELECTED (MULTIPLE = TRUE) */}
          {multiple && (selected as OptionType<L, V>[])?.length > 0 && (
            <span className="rounded-md bg-outline px-1 py-0.5 text-xs text-white">
              {(selected as OptionType<L, V>[]).length}
            </span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
            <ChevronDownIcon className="h-5 w-5 text-dim" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`
              absolute right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
              ${width}
            `}
          >
            {/* DESCRIPTION */}
            {description && <p className="py-1 px-4 text-xs text-dim">{description}</p>}
            {/* OPTIONS */}
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) => `
                  relative flex cursor-default select-none items-center gap-2 py-2 pr-4
                  ${multiple ? "pl-10" : "pl-4"}
                  ${active ? "bg-washed" : ""}
                `}
                onClick={() => (multiple ? onChange(option) : null)}
                value={option}
              >
                {enableFlag && (
                  <Image
                    src={`/static/images/states/${option.value}.jpeg`}
                    width={20}
                    height={12}
                    alt={option.label as string}
                  />
                )}
                <span
                  className={`block truncate ${
                    option === selected ? "font-medium" : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
                {multiple && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <input
                      type="checkbox"
                      checked={isObjInArr(selected as OptionType<L, V>[], option)}
                      className="h-4 w-4 rounded border-outline text-dim focus:ring-0"
                    />
                  </span>
                )}
              </Listbox.Option>
            ))}
            {/* CLEAR ALL (MULTIPLE = TRUE) */}
            {multiple && (
              <li
                onClick={clearSelected}
                className="group relative flex cursor-default select-none items-center gap-2 py-2 pr-4 pl-10 text-dim hover:bg-washed"
              >
                <p>Clear</p>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <XMarkIcon className="h-5 w-5" />
                </span>
              </li>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Dropdown;
