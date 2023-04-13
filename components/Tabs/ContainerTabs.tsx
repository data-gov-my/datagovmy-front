import { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { clx } from "@lib/helpers";

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

const ContainerTabs: FunctionComponent<ContainerTabsProps> & { Panel: typeof Panel } = ({
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
            "flex flex-wrap items-baseline justify-between gap-4 border-b border-outline dark:border-b-outlineHover-dark",
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
                      "group flex w-min flex-col items-center justify-center px-4 py-1 text-xs outline-none transition-colors sm:w-auto sm:flex-row lg:text-sm",
                      selected
                        ? "border-b-2 border-primary font-medium text-black dark:bg-washed-dark dark:text-white"
                        : "bg-transparent text-dim hover:text-black dark:hover:text-white"
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

export { Panel };
export default ContainerTabs;
