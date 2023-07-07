import Fonts from "@config/font";
import { Transition, Dialog } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { clx } from "@lib/helpers";
import { Fragment, FunctionComponent, ReactNode, useState } from "react";

type TooltipProps = {
  children?: (open: () => void) => ReactNode;
  tip: ReactNode;
  className?: string;
};

const Tooltip: FunctionComponent<TooltipProps> = ({ children, tip, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative">
      {children ? (
        children(() => setIsOpen(true))
      ) : (
        <>
          {Boolean(tip) && (
            <>
              <InformationCircleIcon className="text-outlineHover mb-1 hidden h-4 w-4 md:inline-block" />
              <InformationCircleIcon
                className="text-outlineHover mb-1 inline-block h-4 w-4 md:hidden"
                onClick={() => setIsOpen(true)}
              />
            </>
          )}
        </>
      )}
      <div
        className={clx(
          "invisible absolute bottom-7 left-1/2 z-10 flex w-max max-w-[200px] -translate-x-1/2 transform flex-col items-center group-hover:visible group-hover:flex"
        )}
      >
        <span
          className={clx(
            "shadow-floating relative whitespace-nowrap rounded-lg bg-black text-sm text-white dark:bg-white dark:text-black",
            "px-1.5 py-1"
          )}
        >
          {tip}
        </span>
        <div
          className={clx(
            "absolute top-6 h-2 w-2 rotate-45 bg-black dark:bg-white"
            // anchor === "left" && "left-[10%]",
            // anchor === "right" && "right-[10%]"
          )}
        ></div>
      </div>

      {/* <div className={className ? className : "tooltip-content"}>{tip}</div> */}

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={clx(Fonts.body.variable, "relative z-10 font-sans")}
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-outlineHover fixed inset-0 bg-opacity-70 transition-opacity" />
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
    </div>
  );
};
export default Tooltip;
