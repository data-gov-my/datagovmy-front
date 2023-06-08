import { FunctionComponent } from "react";

type NavProps = {
  isTabletNavOpen: boolean;
  children: React.ReactNode;
};

const Nav: FunctionComponent<NavProps> = ({ isTabletNavOpen, children }) => {
  return (
    <>
      {/* MOBILE NAV MENU */}
      <div
        className={[
          "fixed top-[57px] left-0 w-full flex-col gap-0 bg-white py-1 px-0 shadow-lg md:hidden md:gap-1 md:p-1",
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
