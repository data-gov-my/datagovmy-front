import { FunctionComponent, ReactNode, useState, TouchEvent } from "react";
import { Transition } from "@headlessui/react";
import Button from "../Button";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "../../hooks/useTranslation";

interface SidebarProps {
  mobileTrigger: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ mobileTrigger, children }) => {
  const [show, setShow] = useState<boolean>(false);
  const [touch, setTouch] = useState<number>(0);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouch(e.touches[0].clientX);
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const endX = e.changedTouches[0].clientX;
    if (touch && touch - endX > 70) setShow(false);
  };

  const open = () => setShow(true);
  const close = () => setShow(false);

  return (
    <>
      {/* Desktop */}
      <div className="dark:border-r-washed-dark hidden border-r lg:block lg:w-1/4 xl:w-1/5">
        {children(close)}
      </div>

      {/* Mobile */}
      <div className="relative block w-full lg:hidden">
        {mobileTrigger(open)}
        <Transition
          show={show}
          as="div"
          className="dark:border-washed-dark shadow-floating fixed left-0 top-14 z-30 flex h-screen w-4/5 flex-col border border-r bg-white dark:bg-black sm:w-1/3"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          enter="transition-transform duration-75"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform duration-150"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          {children(close)}
        </Transition>
      </div>
    </>
  );
};

export default Sidebar;
