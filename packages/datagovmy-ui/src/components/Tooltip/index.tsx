import { Transition, Dialog } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { clx } from "../../lib/helpers";
import { Fragment, FunctionComponent, ReactNode, useState } from "react";
import { body } from "../../configs/font";

type TooltipProps = {
  children?: (open: () => void) => ReactNode;
  className?: string;
  tip: ReactNode;
};

const Tooltip: FunctionComponent<TooltipProps> = ({ children, className, tip }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative">
      {children ? (
        children(() => setIsOpen(true))
      ) : (
        <>
          {Boolean(tip) && (
            <>
              <InformationCircleIcon
                className={clx("text-outlineHover mb-1 hidden h-4 w-4 md:inline-block", className)}
              />
              <InformationCircleIcon
                className={clx("text-outlineHover mb-1 inline-block h-4 w-4 md:hidden", className)}
                onClick={() => setIsOpen(true)}
              />
            </>
          )}
        </>
      )}
      <div className="invisible absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 transform flex-col items-center group-hover:visible group-hover:flex lg:flex">
        <span
          className={clx(
            "shadow-floating absolute bottom-1 w-max max-w-[200px] rounded-lg bg-black px-3 py-2 text-sm font-normal text-white dark:bg-white dark:text-black",
            className
          )}
        >
          {tip}
        </span>
        <div className=" h-2 w-2 rotate-45 bg-black dark:bg-white"></div>
      </div>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={clx(body.variable, "relative z-10 font-sans")}
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
            <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
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
                <Dialog.Panel className="shadow-floating relative h-fit w-max max-w-[200px] transform rounded-lg bg-black px-3 py-1.5 text-left text-sm text-white transition-all dark:bg-white dark:text-black">
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
