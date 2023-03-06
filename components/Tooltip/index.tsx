import { Transition, Dialog } from "@headlessui/react";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { Fragment, FunctionComponent, ReactNode, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import { BREAKPOINTS } from "@lib/constants";

type TooltipProps = {
  children?: (open: () => void) => ReactNode;
  tip: ReactNode;
};

const Tooltip: FunctionComponent<TooltipProps> = ({ children, tip }) => {
  const width = useWindowWidth();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tooltip w-fit">
      {children ? (
        children(() => setIsOpen(true))
      ) : (
        <>
          {Boolean(tip) && (
            <>
              <InformationCircleIcon className="mb-1 hidden h-4 w-4 text-outlineHover md:inline-block" />
              <InformationCircleIcon
                className="mb-1 inline-block h-4 w-4 text-outlineHover md:hidden"
                onClick={() => setIsOpen(true)}
              />
            </>
          )}
        </>
      )}

      {width > BREAKPOINTS.MD ? (
        <div className="tooltip-content">{tip}</div>
      ) : (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-outlineHover bg-opacity-70 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative h-fit transform overflow-hidden rounded bg-black p-3 text-left text-sm text-white shadow-xl transition-all">
                    {tip}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </div>
  );
};
export default Tooltip;
