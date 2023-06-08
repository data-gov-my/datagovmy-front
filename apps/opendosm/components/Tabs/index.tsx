import { FunctionComponent, ReactElement, ReactNode, useMemo, useState } from "react";
import { Tab } from "@headlessui/react";
import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "@hooks/useTranslation";

interface TabsProps {
  children: ReactNode;
  className?: string;
  current?: number;
  state?: ReactNode;
  title?: ReactNode;
  menu?: ReactNode;
  controls?: ReactNode;
  onChange?: (index: number) => void;
}

const Tabs: FunctionComponent<TabsProps> = ({
  className = "flex justify-start gap-2",
  children,
  title,
  controls,
  current,
  state,
  menu,
  onChange = () => {},
}) => {
  const { t } = useTranslation();

  const _children = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <div className={`flex flex-wrap items-baseline justify-between gap-4 ${className}`}>
          <div>
            {title && typeof title === "string" ? (
              <span className="text-base font-bold">{title}</span>
            ) : (
              title
            )}
            {state && typeof state === "string" ? (
              <p className="pt-4 text-sm text-dim">
                {t("common.data_for", { state: CountryAndStates[state] })}
              </p>
            ) : (
              <>{state}</>
            )}
          </div>

          <Tab.List className="item-center flex flex-wrap justify-between gap-[10px] lg:items-start lg:justify-end">
            {controls}
            <div className="flex flex-grow flex-wrap gap-3">
              {_children.map(({ props: { name } }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    selected
                      ? "text-base font-medium text-black underline underline-offset-4"
                      : "text-base text-dim underline underline-offset-4"
                  }
                >
                  {name}
                </Tab>
              ))}
            </div>

            {menu && <div>{menu}</div>}
          </Tab.List>
        </div>

        <Tab.Panels className="w-full">
          {_children.map(({ props: { children } }, index) => (
            <Tab.Panel key={index}>{children}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

interface PanelProps {
  name: string | ReactElement;
  children?: ReactNode;
}

const Panel: FunctionComponent<PanelProps> = ({ children, name }) => {
  return <>{children}</>;
};

export { Panel };
export default Tabs;
