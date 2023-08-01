import ComboOption, { ComboOptionProp, ComboOptionProps } from "./option";
import { OptionType } from "@components/types";
import { Combobox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { matchSorter, MatchSorterOptions } from "match-sorter";
import { CSSProperties, Fragment, useMemo, useState } from "react";

import { Spinner } from "..";
// import { FixedSizeList } from "react-window";
import { clx } from "@lib/helpers";

type ComboBoxProps<T> = Omit<ComboOptionProps<T>, "option" | "style"> & {
  options: ComboOptionProp<T>[];
  selected?: ComboOptionProp<T> | null;
  onChange: (option?: ComboOptionProp<T>) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  config?: MatchSorterOptions<ComboOptionProp<T>>;
};

const ComboBox = <T extends unknown>({
  options,
  selected,
  onChange,
  onSearch,
  format,
  placeholder,
  enableFlag = false,
  imageSource,
  fallback,
  loading = false,
  config = { keys: ["label"] },
}: ComboBoxProps<T>) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>("");
  // const threshold = 100;
  const filteredOptions = useMemo<ComboOptionProp<T>[]>(
    () => matchSorter(options, query, config).slice(0, 150),
    [options, query, config]
  );

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative w-full overflow-visible rounded-full">
        <div
          className="border-outline hover:border-outlineHover dark:border-outlineHover-dark shadow-button relative w-full 
        select-none overflow-hidden rounded-full border bg-white text-left text-base focus:outline-none focus-visible:ring-0 dark:bg-black"
        >
          <Combobox.Button as={"div"} className="w-full">
            <Combobox.Input
              placeholder={placeholder}
              className="w-full truncate border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black"
              displayValue={(option: OptionType) => option?.label}
              onChange={event => {
                setQuery(event.target.value);
                if (onSearch) onSearch(event.target.value);
              }}
              spellCheck={false}
            />

            <span className="absolute left-3.5 top-3.5">
              <MagnifyingGlassIcon className="dark:text-dim h-5 w-5 text-black" />
            </span>
            {query.length > 0 && (
              <button
                className="hover:bg-washed dark:hover:bg-washed-dark group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
                onClick={() => onChange(undefined)}
              >
                <XMarkIcon className="text-dim absolute right-1.5 h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              </button>
            )}
            {selected && (
              <button
                className="hover:bg-washed dark:hover:bg-washed-dark group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
                onClick={() => onChange(undefined)}
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
          <Combobox.Options
            className={clx(
              "border-outline dark:border-washed-dark shadow-floating absolute z-20 mt-1 max-h-60 w-full rounded-md border bg-white text-sm focus:outline-none dark:bg-black sm:text-sm",
              "overflow-auto"
            )}
          >
            {loading ? (
              <div className="text-dim cursor-deault relative flex select-none flex-row items-center gap-2 px-4 py-2	">
                <Spinner loading={loading} /> {t("common:placeholder.loading")}
              </div>
            ) : filteredOptions.length === 0 && query !== "" ? (
              <div className="text-dim relative cursor-default select-none px-4 py-2">
                {t("common:placeholder.no_results")}
              </div>
            ) : (
              // TODO: Fix weird scrolling issue later
              // : filteredOptions.length > threshold ? (
              //   <FixedSizeList
              //     height={240}
              //     width={"100%"}
              //     itemCount={filteredOptions.length}
              //     itemSize={32}
              //     layout="vertical"
              //   >
              //     {({ index, style }: { index: number; style: CSSProperties }) => (
              //       <ComboOption
              //         option={filteredOptions[index]}
              //         key={index}
              //         style={style}
              //         format={format}
              //         enableFlag={enableFlag}
              //         imageSource={imageSource}
              //         fallback={fallback}
              //       />
              //     )}
              //   </FixedSizeList>
              // )
              filteredOptions.map((option, index) => (
                <ComboOption
                  key={option.value}
                  option={option}
                  format={format}
                  enableFlag={enableFlag}
                  imageSource={imageSource}
                  fallback={fallback}
                />
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default ComboBox;
