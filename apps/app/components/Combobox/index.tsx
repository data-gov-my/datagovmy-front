import { default as Image } from "next/image";
import { Fragment, useState } from "react";
import { OptionType } from "@components/types";
import { Combobox, Transition } from "@headlessui/react";
import { CheckCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { PoliticalParty } from "@lib/constants";
import { clx } from "@lib/helpers";

type ComboBoxProps<L, V> = {
  options: OptionType<L, V>[];
  selected?: OptionType<L, V> | null;
  onChange: (option?: OptionType<L, V>) => void;
  placeholder?: string;
  enableFlag?: boolean;
};

const ComboBox = <L extends string | number = string, V = string>({
  options,
  selected,
  onChange,
  placeholder,
  enableFlag = false,
}: ComboBoxProps<L, V>) => {
  const { t } = useTranslation();
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
    <Combobox value={selected} onChange={onChange} nullable>
      <div className="relative w-5/6 rounded-full sm:w-3/4 md:w-1/2">
        <div
          className={clx(
            `border-outline hover:border-outlineHover dark:border-outlineHover-dark relative w-full select-none overflow-hidden rounded-full
              border bg-white text-left text-base shadow-sm
              focus:outline-none focus-visible:ring-0 dark:bg-black `
          )}
        >
          <Combobox.Button className="w-full">
            {({ open }) => (
              <>
                <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-1.5">
                  <MagnifyingGlassIcon
                    className="dark:text-dim h-5 w-5 text-black"
                    aria-hidden="true"
                  />
                </span>
                <Combobox.Input
                  placeholder={placeholder}
                  className={clx(
                    "w-full border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black"
                  )}
                  displayValue={(option: OptionType<L, V>) =>
                    enableFlag ? PoliticalParty[option?.label as string] : (option?.label as string)
                  }
                  onChange={event => setQuery(event.target.value)}
                  onClick={(e: any) => {
                    if (open) e.stopPropagation();
                  }}
                  spellCheck={false}
                />
                {/* {query.length > 0 && (
                      <XMarkIcon
                        className="absolute top-3 right-3 box-content flex h-5 w-5 items-center pr-1.5 text-black dark:text-dim"
                        aria-hidden="true"
                      />
                    )} */}
                {selected && (
                  <XMarkIcon
                    onClick={() => onChange(undefined)}
                    className="dark:text-dim absolute right-3 top-3 box-content flex h-5 w-5 items-center pr-1.5 text-black"
                    aria-hidden="true"
                  />
                )}
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
          <Combobox.Options
            static
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black sm:text-sm"
          >
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="text-dim relative cursor-default select-none px-4 py-2">
                {t("common:placeholder.no_results")}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    `relative flex w-full cursor-pointer select-none flex-row gap-2 px-4 py-2 ${
                      active ? "bg-washed dark:bg-washed-dark" : ""
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <div className="flex w-full items-center gap-2">
                      {enableFlag ? (
                        <>
                          <Image
                            src={`/static/images/parties/${option.value}.png`}
                            width={20}
                            height={12}
                            alt={option.label as string}
                          />
                          <span
                            className={clx(
                              "block truncate ",
                              selected ? "font-medium" : "font-normal"
                            )}
                          >
                            {PoliticalParty[option.label as string]}
                          </span>
                        </>
                      ) : (
                        <span
                          className={clx(
                            "block truncate ",
                            selected ? "font-medium" : "font-normal"
                          )}
                        >
                          {option.label}
                        </span>
                      )}
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckCircleIcon className="text-primary dark:text-primary-dark h-4 w-4" />
                        </span>
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
  );
};

export default ComboBox;
