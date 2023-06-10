import { Tab as HeadlessTab } from "@headlessui/react";
import cn from "clsx";
import type { ReactElement, ReactNode } from "react";

type TabItem = {
  label: ReactElement;
  disabled?: boolean;
};

function isTabItem(item: unknown): item is TabItem {
  if (item && typeof item === "object" && "label" in item) return true;
  return false;
}

const renderTab = (item: ReactNode | TabItem) => {
  if (isTabItem(item)) {
    return item.label;
  }
  return item;
};

export function Tabs({
  items,
  selectedIndex,
  defaultIndex,
  onChange,
  children,
}: {
  items: ReactNode[] | ReadonlyArray<ReactNode> | TabItem[];
  selectedIndex?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  children: ReactNode;
}): ReactElement {
  return (
    <HeadlessTab.Group
      selectedIndex={selectedIndex}
      defaultIndex={defaultIndex}
      onChange={onChange}
    >
      <div className="nextra-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain">
        <HeadlessTab.List className="mt-4 flex w-max min-w-full border-b border-gray-200 pb-px dark:border-neutral-800">
          {items.map((item, index) => {
            const disabled = !!(
              item &&
              typeof item === "object" &&
              "disabled" in item &&
              item.disabled
            );

            return (
              <HeadlessTab
                key={index}
                disabled={disabled}
                className={({ selected }) =>
                  cn(
                    "mr-2 rounded-t p-2 font-medium leading-5 transition-colors",
                    "-mb-0.5 select-none border-b-2",
                    selected
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-600 hover:border-gray-200 hover:text-black dark:text-gray-200 dark:hover:border-neutral-800 dark:hover:text-white",
                    disabled && "pointer-events-none text-gray-400 dark:text-neutral-600"
                  )
                }
              >
                {renderTab(item)}
              </HeadlessTab>
            );
          })}
        </HeadlessTab.List>
      </div>
      <HeadlessTab.Panels>{children}</HeadlessTab.Panels>
    </HeadlessTab.Group>
  );
}

export function Tab({ children, ...props }: Parameters<typeof HeadlessTab.Panel>[0]): ReactElement {
  return (
    <HeadlessTab.Panel {...props} className="rounded pt-6">
      {children}
    </HeadlessTab.Panel>
  );
}
