import { clx } from "@lib/helpers";
import { FunctionComponent, ReactNode } from "react";

type NavProps = {
  isTabletNavOpen: boolean;
  children: ReactNode;
};

const Nav: FunctionComponent<NavProps> = ({ isTabletNavOpen, children }) => {
  return (
    <>
      {/* MOBILE NAV MENU */}
      <div
        className={clx(
          "fixed top-[57px] left-0 w-full flex-col gap-0 divide-y bg-white py-2 px-4 shadow-lg backdrop-blur-md dark:divide-washed-dark dark:bg-black/80 lg:hidden lg:gap-1 lg:divide-y-0 lg:p-1",
          isTabletNavOpen ? "flex" : "hidden"
        )}
      >
        {children}
      </div>
      {/* DESKTOP NAV BAR */}
      <div className="hidden w-full gap-2 lg:flex">{children}</div>
    </>
  );
};

export default Nav;
