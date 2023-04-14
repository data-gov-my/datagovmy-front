import { Fragment, useRef, useState } from "react";
import { useTranslation } from "@hooks/useTranslation";
import { Combobox, Transition } from "@headlessui/react";
import { default as Image } from "next/image";
import { OptionType } from "@components/types";
import { clx } from "@lib/helpers";
import { CheckCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "@components/Button";

type ComboBoxProps<L, V> = {
  options: OptionType<L, V>[];
  selected?: OptionType<L, V> | null;
  onChange: (option?: OptionType<L, V>) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  enableFlag?: boolean;
};

const ComboBox = <L extends string | number = string, V = string>({
  options,
  selected,
  onChange,
  placeholder,
  disabled = false,
  width,
  enableFlag = false,
}: ComboBoxProps<L, V>) => {
  const { t } = useTranslation();
  const comboboxButtonRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter(option =>
          option.label
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className={` ${disabled ? "cursor-not-allowed" : ""}`}>
      <div className={`${width ?? ""} ${disabled ? "pointer-events-none" : ""}`}>
        <Combobox value={selected} onChange={onChange} nullable>
          <div className="relative rounded-md shadow-sm">
            <div
              className={clx(
                `relative w-fit overflow-hidden rounded-full border border-outline bg-white text-left
                 text-base shadow-sm hover:border-outlineHover focus:outline-none focus-visible:ring-0
                dark:border-outlineHover-dark dark:bg-black lg:w-[500px]`
              )}
            >
              <Combobox.Button className={"w-full"}>
                {({ open }) => (
                  <>
                    <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-1.5">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-black dark:text-dim"
                        aria-hidden="true"
                      />
                    </span>
                    <Combobox.Input
                      placeholder={placeholder}
                      className={clx(
                        "w-full border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black"
                      )}
                      displayValue={(option: OptionType<L, V>) => option?.label as string}
                      onChange={event => setQuery(event.target.value)}
                      onClick={(e: any) => {
                        if (open) e.stopPropagation();
                      }}
                      spellCheck={false}
                    />
                    {query ||
                      (selected && (
                        <Button
                          className="absolute inset-y-0 right-2 box-content flex items-center pr-1.5"
                          onClick={() => onChange(undefined)}
                        >
                          <XMarkIcon
                            className="h-5 w-5 text-black dark:text-dim"
                            aria-hidden="true"
                          />
                        </Button>
                      ))}
                  </>
                )}
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black sm:text-sm">
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-dim">
                    {t("common:placeholder.no_results")}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <Combobox.Option
                      key={index}
                      className={({ active }) =>
                        `relative flex cursor-pointer select-none flex-row py-2 px-3 ${
                          active ? "bg-washed dark:bg-washed-dark" : ""
                        }`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <div className="flex w-full items-center justify-between gap-2">
                          {enableFlag && (
                            <Image
                              src={`/static/images/states/${option.value}.jpeg`}
                              width={20}
                              height={12}
                              alt={option.label as string}
                            />
                          )}
                          <span
                            className={clx(
                              "block truncate ",
                              selected ? "font-medium" : "font-normal"
                            )}
                          >
                            {option.label}
                          </span>
                          {selected && (
                            // <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <CheckCircleIcon className="h-4 w-4 text-primary dark:text-primary-dark" />
                            // </span>
                          )}
                        </div>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
};

export default ComboBox;
