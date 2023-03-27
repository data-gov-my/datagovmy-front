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
        className={[
          "fixed top-[57px] left-0 w-full flex-col gap-0 divide-y bg-white py-2 px-4 shadow-lg backdrop-blur-md dark:divide-washed-dark dark:bg-black/80 md:hidden md:gap-1 md:divide-y-0 md:p-1",
          isTabletNavOpen ? "flex" : "hidden",
        ].join(" ")}
      >
        {children}
      </div>
      {/* DESKTOP NAV BAR */}
      <div className="hidden gap-2 md:flex">{children}</div>
    </>
  );
};

export default Nav;
