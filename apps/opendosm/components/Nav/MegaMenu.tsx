import { Fragment, useState, ReactElement, SetStateAction, Dispatch } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";

type MegaMenuProps = {
  icon?: JSX.Element;
  title: string;
  children: ReactElement[] | ReactElement;
};

const MegaMenu: React.FC<MegaMenuProps> = ({ icon, title, children }) => {
  const windowWidth = useWindowWidth();
  const isTablet = windowWidth >= BREAKPOINTS.MD;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile view */}
      {!isTablet ? (
        <>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center gap-2 bg-white px-2 py-2 text-sm font-medium hover:cursor-pointer hover:bg-washed focus:bg-washed md:py-[6px]"
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
          {isOpen && children}
        </>
      ) : (
        // Desktop view
        <Popover
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="relative"
        >
          <>
            <Popover.Button className="button-dashboard flex items-center gap-2 rounded-md bg-white px-2 py-[6px] text-sm font-medium hover:cursor-pointer hover:bg-washed focus:outline-none">
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
              <Popover.Panel className="fixed left-0 z-10 mt-0 w-screen overflow-hidden border bg-white shadow-lg md:mt-2.5">
                {children}
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      )}
    </>
  );
};

export default MegaMenu;
