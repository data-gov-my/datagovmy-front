import { clx } from "../../lib/helpers";
import { Disclosure, Transition } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { FunctionComponent, ReactNode } from "react";

type AccordionProps = {
  className?: string;
  width?: string;
  title: string;
  children: ReactNode;
};

const Accordion: FunctionComponent<AccordionProps> = ({
  className,
  width = "w-full",
  title,
  children,
}) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            as="div"
            className={clx(
              open ? "rounded-none" : "shadow-button rounded-b-xl",
              "active:bg-washed hover:dark:bg-washed-dark px-4.5 flex items-center gap-x-3 rounded-t-xl bg-white py-3 dark:bg-black",
              "border-outline dark:border-washed-dark hover:border-outlineHover hover:dark:border-outlineHover-dark border outline-none",
              "cursor-pointer select-none text-start text-sm font-medium text-black dark:text-white",
              width,
              className
            )}
          >
            {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
            {title}
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <div
                className={clx(
                  "text-dim border-outline dark:border-washed-dark shadow-button px-4.5 rounded-b-xl border border-t-0 py-3",
                  width
                )}
              >
                {children}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Accordion;
