import { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { clx } from "@lib/helpers";
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";

interface ContainerTabsProps {
  children: ReactNode;
  hidden?: boolean;
  className?: string;
  current: number;
  onChange?: (index: number) => void;
}
interface PanelProps {
  name: string | ReactElement;
  icon: ReactNode;
  className?: string;
  children?: ReactNode;
}

const Panel: FunctionComponent<PanelProps> = ({ children }) => {
  return <>{children}</>;
};

interface ListProps {
  options: {
    name: string;
    icon: ReactNode;
    url?: Url;
  }[];
  icons?: Array<ReactNode>;
  className?: string;
  current: number;
  onClick?: () => void;
}

const List: FunctionComponent<ListProps> = ({ className, options, current, onClick, icons }) => {
  const router = useRouter();
  return (
    <div
      className={clx(
        "border-outline dark:border-b-outlineHover-dark flex flex-wrap items-baseline justify-between gap-4 border-b",
        className
      )}
    >
      <ul className="mx-auto flex flex-wrap items-center justify-between">
        <div className="flex h-fit flex-grow flex-nowrap sm:h-[56px]">
          {options.map(({ name, icon, url }, index) => (
            <li
              key={index}
              className={clx(
                "group flex w-min select-none flex-col items-center justify-center px-4 py-1 text-sm outline-none transition-colors sm:w-auto sm:flex-row",
                current === index
                  ? "border-primary dark:bg-washed-dark cursor-default border-b-2 font-medium text-black dark:text-white"
                  : "text-dim cursor-pointer bg-transparent hover:text-black dark:hover:text-white"
              )}
              onClick={() => (url ? router.push(url) : null)}
            >
              {icon}
              {name}
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

const ContainerTabs: FunctionComponent<ContainerTabsProps> & {
  Panel: typeof Panel;
  List: typeof List;
} = ({
  className = "flex justify-start gap-2",
  hidden,
  children,
  current,
  onChange = () => {},
}) => {
  const _children = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <div
          className={clx(
            "border-outline dark:border-b-outlineHover-dark flex flex-wrap items-baseline justify-between gap-4 border-b",
            className
          )}
        >
          <Tab.List
            className={clx(
              "mx-auto flex flex-wrap items-center justify-between",
              hidden && "hidden"
            )}
          >
            <div className="flex h-fit flex-grow flex-nowrap sm:h-[56px]">
              {_children.map(({ props: { name, icon } }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    clx(
                      "group flex w-min flex-col items-center justify-center px-4 py-1 text-sm outline-none transition-colors sm:w-auto sm:flex-row",
                      selected
                        ? "border-primary dark:bg-washed-dark border-b-2 font-medium text-black dark:text-white"
                        : "text-dim bg-transparent hover:text-black dark:hover:text-white"
                    )
                  }
                >
                  {icon}
                  {name}
                </Tab>
              ))}
            </div>
          </Tab.List>
        </div>

        <Tab.Panels className="w-full">
          {_children.map(({ props: { children } }, index) => (
            <Tab.Panel className="overflow-clip" key={index}>
              {children}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

ContainerTabs.Panel = Panel;
ContainerTabs.List = List;

export { List };
export { Panel };
export default ContainerTabs;
