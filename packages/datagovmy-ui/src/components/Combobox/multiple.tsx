import ComboOption, { ComboOptionProp, ComboOptionProps } from "./option";
import { Button, Spinner } from "..";
import { useTranslation } from "../../hooks/useTranslation";
import { clx } from "../../lib/helpers";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useCombobox, useMultipleSelection } from "downshift";
import { ChangeEvent, useMemo, useRef } from "react";

type ComboBoxProps<T> = Pick<ComboOptionProps<T>, "format" | "image"> & {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (option: ComboOptionProp<T>[]) => void;
  onSearch?: (query: string) => void;
  options: ComboOptionProp<T>[];
  inputValue: string;
  selectedItems: ComboOptionProp<T>[];
  setInputValue: (inputValue: string) => void;
  setSelectedItems: (option: ComboOptionProp<T>[]) => void;
  placeholder?: string;
  width?: string;
};

const MultipleComboBox = <T extends unknown>({
  className,
  disabled,
  format,
  image,
  inputValue,
  loading = false,
  onChange,
  onSearch,
  options,
  selectedItems,
  setInputValue,
  setSelectedItems,
  placeholder,
  width = "w-full sm:w-[500px]",
}: ComboBoxProps<T>) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getFilteredItems = (selectedItems: ComboOptionProp<T>[]) =>
    options.filter(option => {
      return !selectedItems.map(item => item.value).includes(option.value);
    });

  const items = useMemo(() => {
    return !inputValue ? [] : selectedItems.length > 0 ? getFilteredItems(selectedItems) : options;
  }, [options, selectedItems, inputValue]);

  const { getDropdownProps } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems!);
          break;
        default:
          break;
      }
    },
  });

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
    openMenu,
    reset,
    selectedItem,
    selectItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.label : "";
    },
    inputValue,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };

        default:
          return changes;
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            setSelectedItems([...selectedItems, newSelectedItem]);
            onChange([...selectedItems, newSelectedItem]);
            setInputValue("");
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue!);

          break;
        default:
          break;
      }
    },
  });

  return (
    <>
      <div className="relative">
        <div>
          <label {...getLabelProps()} />
          <div
            className={clx(
              "border-outline dark:border-washed-dark shadow-button relative flex w-full select-none items-center overflow-visible rounded-full border bg-white pl-3 focus:outline-none focus-visible:ring-0 dark:bg-black",
              className,
              disabled
                ? "bg-outline dark:bg-washed-dark"
                : "hover:border-outlineHover dark:hover:border-outlineHover-dark",
              width
            )}
          >
            <input
              className="disabled:text-dim w-full truncate rounded-r-full border-none bg-inherit px-0 py-2.5 text-sm focus:outline-none focus:ring-0 disabled:opacity-30"
              disabled={disabled}
              placeholder={placeholder}
              ref={inputRef}
              spellCheck={false}
              type="text"
              {...getInputProps({
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  if (onSearch) onSearch(event.target.value);
                },
                ...getDropdownProps({ preventKeyAction: isOpen }),
              })}
            />
            {inputValue && (
              <Button
                variant="ghost"
                className="mr-1.5 flex size-8 justify-center rounded-full px-1.5"
                onClick={() => {
                  reset();
                  selectItem(null);
                  setInputValue("");
                  openMenu();
                  inputRef.current && inputRef.current.focus();
                }}
              >
                <XMarkIcon className="size-4.5" />
              </Button>
            )}
          </div>
        </div>

        <ul
          className={clx(
            "border-outline dark:border-washed-dark shadow-floating absolute z-10 mt-1 max-h-60 max-w-full overflow-y-auto rounded-md border bg-white text-sm dark:bg-black",
            width,
            loading && inputValue ? "" : !(isOpen && items.length) && "hidden"
          )}
          {...getMenuProps()}
        >
          {loading ? (
            <li className="flex cursor-default select-none items-center gap-2 px-4 py-2 text-zinc-500">
              <Spinner loading={loading} /> {t("placeholder.loading")}
            </li>
          ) : (
            items.length &&
            items.map((item, index) => (
              <ComboOption<T>
                key={index}
                option={item}
                total={options.length}
                format={format}
                image={image}
                isSelected={selectedItem === item}
                active={highlightedIndex === index}
                index={index}
                {...getItemProps({ item, index })}
              />
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default MultipleComboBox;
