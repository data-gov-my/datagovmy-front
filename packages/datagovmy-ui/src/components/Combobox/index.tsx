import { Fragment, FunctionComponent, ReactNode, useState } from "react";
import ImageWithFallback from "../ImageWithFallback";
import { OptionType } from "../types";
import { Combobox, Transition } from "@headlessui/react";
import { CheckCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "../../hooks/useTranslation";
import { clx } from "../../lib/helpers";
import { matchSorter } from "match-sorter";
import Spinner from "../Spinner";

type ComboBoxProps = {
  options: OptionType[];
  selected?: OptionType | null;
  onChange: (option?: OptionType) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  enableFlag?: boolean;
  imageSource?: string;
  fallback?: ReactNode;
  enableType?: boolean;
  loading?: boolean;
};

const ComboBox: FunctionComponent<ComboBoxProps> = ({
  options,
  selected,
  onChange,
  onSearch,
  placeholder,
  enableFlag = false,
  imageSource = "/static/images/parties/",
  fallback,
  enableType = false,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options.slice(0, 50)
      : matchSorter(options, query.toLowerCase().replace(/\s+/g, ""), { keys: ["label"] }).slice(
          0,
          50
        );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative w-full overflow-visible rounded-full">
        <div
          className="border-outline hover:border-outlineHover dark:border-outlineHover-dark relative w-full select-none 
        overflow-hidden rounded-full border bg-white text-left text-base shadow-sm focus:outline-none focus-visible:ring-0 dark:bg-black"
        >
          <Combobox.Button as={"div"} className="w-full">
            <Combobox.Input
              placeholder={placeholder}
              className="w-full border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black"
              displayValue={(option: OptionType) => option?.label}
              onChange={event => {
                setQuery(event.target.value);
                if (onSearch) onSearch(event.target.value);
              }}
              spellCheck={false}
            />

            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-1.5">
              <MagnifyingGlassIcon
                className="dark:text-dim h-5 w-5 text-black"
                aria-hidden="true"
              />
            </span>
            {query.length > 0 && (
              <button
                className="hover:bg-washed dark:hover:bg-washed-dark group absolute inset-y-0 right-2 top-2 flex h-8 w-8 items-center rounded-full"
                onClick={() => onChange(undefined)}
                aria-hidden="true"
              >
                <XMarkIcon className="text-dim absolute right-1.5 h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              </button>
            )}
            {selected && (
              <button
                className="hover:bg-washed dark:hover:bg-washed-dark group absolute inset-y-0 right-2 top-2 flex h-8 w-8 items-center rounded-full"
                onClick={() => onChange(undefined)}
                aria-hidden="true"
              >
                <XMarkIcon className="text-dim absolute right-1.5 h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              </button>
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
          <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black sm:text-sm">
            {loading ? (
              <div className="text-dim cursor-deault relative flex select-none flex-row items-center gap-2 px-4 py-2	">
                <Spinner loading={loading} /> {t("common:placeholder.loading")}
              </div>
            ) : filteredOptions.length === 0 && query !== "" ? (
              <div className="text-dim relative cursor-default select-none px-4 py-2">
                {t("common:placeholder.no_results")}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    clx(
                      "relative flex w-full cursor-pointer select-none flex-row gap-2 px-4 py-2",
                      active && "bg-washed dark:bg-washed-dark"
                    )
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <div className="flex w-full items-center gap-2">
                      {enableFlag ? (
                        <>
                          <ImageWithFallback
                            className="border-outline dark:border-outlineHover-dark absolute rounded border"
                            src={`${imageSource}${option.value}.png`}
                            fallback={fallback}
                            width={32}
                            height={18}
                            alt={option.value as string}
                          />
                          <span
                            className={clx(
                              "relative block truncate pl-10",
                              selected ? "font-medium" : "font-normal"
                            )}
                          >
                            {option.label}
                          </span>
                        </>
                      ) : enableType ? (
                        <span
                          className={clx(
                            "block truncate",
                            selected ? "font-medium" : "font-normal",
                            "flex flex-row gap-1"
                          )}
                        >
                          <>{String(option.label).split("(")[0]}</>
                          <p className="text-dim normal-case">{` (${
                            String(option.label).split("(")[1]
                          }`}</p>
                        </span>
                      ) : (
                        <span
                          className={clx(
                            "block truncate",
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