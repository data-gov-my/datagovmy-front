import { Fragment, useState, useContext, FunctionComponent, ReactNode } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { BREAKPOINTS } from "../../lib/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";

interface MegamenuProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
}

const Megamenu: FunctionComponent<MegamenuProps> = ({ icon, title, children }) => {
  const { size } = useContext(WindowContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {size.width <= BREAKPOINTS.MD ? (
        <>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-washed dark:hover:bg-washed-dark flex items-center gap-2 rounded-none px-2 py-2 text-sm font-medium transition hover:cursor-pointer md:rounded-md md:py-[6px]"
          >
            {icon}
            {title}
            {isOpen ? (
              <ChevronUpIcon
                className={`h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            ) : (
              <ChevronDownIcon
                className={`h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            )}
          </div>
          {isOpen && <div>{children}</div>}
        </>
      ) : (
        <Popover
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="relative"
        >
          <>
            <Popover.Button className="hover:bg-washed dark:hover:bg-washed-dark button-dashboard flex items-center gap-2 rounded-none px-2 py-2 text-sm font-medium transition hover:cursor-pointer dark:text-white md:rounded-md md:py-[6px]">
              {icon}
              {title}
              {isOpen ? (
                <ChevronUpIcon
                  className={`dar:text-white h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                  aria-hidden="true"
                />
              ) : (
                <ChevronDownIcon
                  className={`h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                  aria-hidden="true"
                />
              )}
            </Popover.Button>
            <Transition
              show={isOpen}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="fixed left-0 z-10 mt-0 w-screen lg:mt-3">
                <div className="dark:bg-washed-dark dark:border-outlineHover-dark overflow-hidden border-t bg-white shadow-lg">
                  {children}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      )}
    </div>
  );
};

export default Megamenu;
