import { Fragment, useState } from "react";
import ImageWithFallback from "@components/ImageWithFallback";
import { OptionType } from "@components/types";
import { Combobox, Transition } from "@headlessui/react";
import { CheckCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import Fuse from "fuse.js";

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

  const config: Fuse.IFuseOptions<OptionType<L, V>> = {
    keys: ["label"],
  };
  const fuse = new Fuse(options, config);
  const filteredOptions =
    query === "" ? options.slice(0, 100) : fuse.search(query, { limit: 100 }).map(res => res.item);

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative w-full rounded-full">
        <div
          className="border-outline hover:border-outlineHover dark:border-outlineHover-dark relative w-full select-none 
        overflow-hidden rounded-full border bg-white text-left text-base shadow-sm focus:outline-none focus-visible:ring-0 dark:bg-black"
        >
          <Combobox.Input
            placeholder={placeholder}
            className="w-full border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black"
            displayValue={(option: OptionType<L, V>) => option?.label as string}
            onChange={event => setQuery(event.target.value)}
            spellCheck={false}
          />
          <Combobox.Button as={"div"} className="w-full">
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-1.5">
              <MagnifyingGlassIcon
                className="dark:text-dim h-5 w-5 text-black"
                aria-hidden="true"
              />
            </span>
            {query.length > 0 && (
              <span className="absolute inset-y-0 right-2 box-content flex cursor-pointer items-center pr-1.5">
                <XMarkIcon
                  className="dark:text-dim h-5 w-5 text-black"
                  onClick={() => onChange(undefined)}
                  aria-hidden="true"
                />
              </span>
            )}
            {selected && (
              <span className="absolute inset-y-0 right-2 box-content flex cursor-pointer items-center pr-1.5">
                <XMarkIcon
                  className="dark:text-dim h-5 w-5 text-black"
                  onClick={() => onChange(undefined)}
                  aria-hidden="true"
                />
              </span>
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
                          <ImageWithFallback
                            src={`/static/images/parties/${option.value}.png`}
                            width={20}
                            height={12}
                            alt={option.value as string}
                          />
                          <span
                            className={clx(
                              "block truncate ",
                              selected ? "font-medium" : "font-normal"
                            )}
                          >
                            {option.label}
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
