import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { clx } from "@lib/helpers";
import At from "@components/At";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useState } from "react";
import Dropdown from "@components/Dropdown";
import { languages } from "@lib/options";
import ThemeToggle from "./theme";

import { useLanguage } from "@hooks/useLanguage";

type NavRootProps = {
  children: (close: () => void) => ReactNode;
  stateSelector?: ReactNode;
};

type NavItemProps = {
  icon?: ReactNode;
  title: string;
  link: string;
  onClick: () => void;
  className?: string;
};

type NavFunctionComponent = FunctionComponent<NavRootProps> & {
  Item: typeof Item;
};

const Item: FunctionComponent<NavItemProps> = ({ link, onClick, className, icon, title }) => {
  const { pathname } = useRouter();
  return (
    <At
      href={link}
      scroll={false}
      onClick={onClick}
      className={clx(
        "flex items-center gap-2 rounded-none px-2 py-2 text-sm font-medium transition hover:cursor-pointer hover:bg-washed dark:hover:bg-washed-dark md:rounded-md md:py-[6px]",
        pathname.startsWith(link) && link !== "/" ? "bg-washed dark:bg-washed-dark" : "",
        className
      )}
    >
      {icon}
      {title}
    </At>
  );
};

const Nav: NavFunctionComponent = ({ children, stateSelector }) => {
  const [showMobile, setShowMobile] = useState<boolean>(false);
  const { language, onLanguageChange } = useLanguage();

  const close = () => setShowMobile(false);
  const open = () => setShowMobile(true);

  return (
    <div className="flex w-full items-center justify-end lg:justify-between">
      {/* Desktop */}
      <div className="hidden w-fit gap-2 lg:flex">{children(close)}</div>
      <div className="hidden w-fit gap-4 lg:flex">
        {stateSelector}
        <ThemeToggle />
        <Dropdown
          width="w-fit"
          selected={languages.find(lang => lang.value === language)}
          onChange={onLanguageChange}
          options={languages}
        />
      </div>

      {/* Mobile - Header*/}
      <div className="flex w-full items-center justify-end gap-3 lg:hidden">
        {stateSelector}
        <ThemeToggle />
        <Dropdown
          width="w-fit"
          selected={languages.find(lang => lang.value === language)}
          onChange={onLanguageChange}
          options={languages}
        />
        {showMobile ? (
          <XMarkIcon
            className="box-content block h-5 w-5 text-black dark:text-white lg:hidden"
            onClick={close}
          />
        ) : (
          <Bars3BottomRightIcon
            className="box-content block h-5 w-5 text-black dark:text-white lg:hidden"
            onClick={open}
          />
        )}
      </div>
      {/* Mobile - Menu */}
      <div
        className={clx(
          "fixed top-[57px] left-0 flex w-full flex-col gap-0 divide-y bg-white py-2 px-4 shadow-lg backdrop-blur-md dark:divide-washed-dark dark:bg-black/80 lg:hidden lg:gap-1 lg:divide-y-0 lg:p-1",
          showMobile ? "flex" : "hidden"
        )}
      >
        {children(close)}
      </div>
    </div>
  );
};

Nav.Item = Item;

export default Nav;
