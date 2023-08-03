import { Popover, Transition } from "@headlessui/react";
import cn from "clsx";
// import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, ReactNode, Fragment } from "react";

interface TooltipProps {
  trigger: (open: boolean) => ReactNode;
  anchor?: "top-right" | "top-left";
  className?: string;
  children: ReactNode;
}
const Tooltip: FunctionComponent<TooltipProps> = ({
  trigger,
  className,
  children,
  anchor = "top-right",
}) => {
  const styles = {
    "top-left":
      "absolute bottom-full left-0 z-10 mb-1 flex w-max transform flex-col items-center group-hover:visible",
    "top-right":
      "absolute bottom-full z-10 mt-3 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl",
  };

  return (
    <Popover className={cn("relative", className)}>
      {({ open }) => (
        <>
          <Popover.Button>{trigger(open)}</Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className={cn(styles[anchor], className)}>
              <div className="dark:border-outlineHover-dark w-fit overflow-hidden rounded-lg border bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black">
                {children}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Tooltip;
