import { Fragment, useState } from "react";
import { useTranslation } from "@hooks/useTranslation";
import { Combobox, Transition } from "@headlessui/react";

import { OptionType } from "@components/types";

type ComboBoxProps<L, V> = {
  options: OptionType<L, V>[];
  selected?: OptionType<L, V>;
  onChange: (option?: OptionType<L, V>) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
};

const ComboBox = <L extends string | number = string, V = string>({
  options,
  selected,
  onChange,
  placeholder,
  disabled = false,
  width,
}: ComboBoxProps<L, V>) => {
  const { t } = useTranslation("kawasanku");

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
              className={`
                relative w-full cursor-pointer overflow-hidden rounded-md border bg-white text-left 
                shadow-sm hover:border-outlineHover focus:outline-none focus-visible:ring-0
                ${disabled ? "border-transparent bg-outline" : "border-outline "}
              `}
            >
              <Combobox.Input
                placeholder={placeholder}
                className={`
                  w-full border-none py-2 pl-3 pr-10 text-sm focus:bg-washed focus:outline-none focus:ring-0
                  ${disabled ? "bg-outline text-outlineHover" : ""}
                `}
                displayValue={(option: OptionType<L, V>) => option?.label as string}
                onChange={event => setQuery(event.target.value)}
              />
              <Combobox.Button
                className={`
                  absolute inset-y-0 right-0 flex items-center pr-2 
                  ${disabled ? "text-outlineHover" : ""}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-dim">
                    {t("no_results")}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <Combobox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-3 ${active ? "bg-washed" : ""}`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {option.label}
                        </span>
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
