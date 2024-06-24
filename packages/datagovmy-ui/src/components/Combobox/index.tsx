import ComboOption, { ComboOptionProp, ComboOptionProps } from "./option";
import { Button, Spinner } from "..";
import { useTranslation } from "../../hooks/useTranslation";
import { clx } from "../../lib/helpers";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useCombobox } from "downshift";
import { matchSorter, MatchSorterOptions } from "match-sorter";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

type ComboBoxProps<T> = Pick<ComboOptionProps<T>, "format" | "image"> & {
  options: ComboOptionProp<T>[];
  selected?: ComboOptionProp<T> | null;
  onChange: (option?: ComboOptionProp<T>) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  config?: MatchSorterOptions<ComboOptionProp<T>>;
  className?: string;
};

const ComboBox = <T extends unknown>({
  options,
  selected,
  onChange,
  onSearch,
  format,
  placeholder,
  image,
  loading = false,
  config = { keys: ["label"] },
  className,
}: ComboBoxProps<T>) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(options);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: useCallback(() => 36, []),
    overscan: 15,
  });

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    inputValue,
    isOpen,
    openMenu,
    reset,
    selectItem,
    selectedItem,
    setInputValue,
  } = useCombobox({
    defaultSelectedItem: selected,
    items,
    itemToString: item => (item ? item.label : ""),
    onInputValueChange: ({ inputValue }) => setItems(matchSorter(options, inputValue, config)),
    onHighlightedIndexChange: ({ highlightedIndex, type }) => {
      if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
        rowVirtualizer.scrollToIndex(highlightedIndex!);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) onChange(selectedItem);
    },
  });

  return (
    <div className="relative">
      <div>
        <label {...getLabelProps()} />
        <div
          className={clx(
            "border-outline dark:border-washed-dark hover:border-outlineHover dark:hover:border-outlineHover-dark shadow-button relative flex w-full select-none items-center overflow-visible rounded-full border bg-white pl-4 focus:outline-none focus-visible:ring-0 dark:bg-black",
            className
          )}
        >
          <span className="flex h-auto max-h-8 w-8 shrink-0 justify-center self-center">
            {image && selectedItem ? (
              image(selectedItem.value)
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-500" />
            )}
          </span>

          <input
            {...getInputProps({
              "aria-autocomplete": "list",
              "placeholder": placeholder,
              "ref": inputRef,
              "spellCheck": false,
              "type": "text",
              "onChange": (event: ChangeEvent<HTMLInputElement>) => {
                if (onSearch) onSearch(event.target.value);
              },
            })}
            className="w-full truncate rounded-r-full border-none bg-white py-3 pl-2 pr-0 focus:outline-none focus:ring-0 dark:bg-black"
          />
          {inputValue && (
            <Button
              variant="ghost"
              className="mr-2 flex h-8 w-8 justify-center rounded-full px-1.5"
              onClick={() => {
                reset();
                selectItem(null);
                setInputValue("");
                openMenu();
                inputRef.current && inputRef.current.focus();
              }}
            >
              <XMarkIcon className="size-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="absolute left-0 top-[54px] z-10 w-full">
        <ul
          {...getMenuProps({ ref: listRef })}
          className={clx(
            "border-outline dark:border-washed-dark shadow-floating relative max-h-60 max-w-full overflow-y-auto rounded-md border bg-white text-sm dark:bg-black",
            !(isOpen && items.length) && "hidden"
          )}
        >
          {loading ? (
            <li className="flex cursor-default select-none items-center gap-2 px-4 py-2 text-zinc-500">
              <Spinner loading={loading} /> {t("placeholder.loading")}
            </li>
          ) : items.length === 0 && inputValue !== "" ? (
            <li className="cursor-default select-none px-4 py-2 text-zinc-500">
              {t("placeholder.no_results")}
            </li>
          ) : items.length > 100 ? (
            <>
              <li key="total-size" style={{ height: rowVirtualizer.totalSize }} />
              {rowVirtualizer.virtualItems.map(virtualRow => (
                <ComboOption<T>
                  option={items[virtualRow.index]}
                  total={options.length}
                  format={format}
                  image={image}
                  isSelected={selectedItem?.value === items[virtualRow.index].value}
                  active={highlightedIndex === virtualRow.index}
                  index={virtualRow.index}
                  {...getItemProps({
                    index: virtualRow.index,
                    item: items[virtualRow.index],
                  })}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                />
              ))}
            </>
          ) : (
            items.map((item, index) => (
              <ComboOption<T>
                option={item}
                total={options.length}
                format={format}
                image={image}
                isSelected={selectedItem?.value === item.value}
                active={highlightedIndex === index}
                index={index}
                {...getItemProps({ index, item })}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ComboBox;
