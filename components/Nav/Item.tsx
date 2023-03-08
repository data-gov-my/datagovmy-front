import Link from "next/link";
import React, { FunctionComponent } from "react";

type NavItemProps = {
  icon?: JSX.Element;
  title: string;
  link: string;
  onClick: () => void;
  className?: string;
};

const NavItem: FunctionComponent<NavItemProps> = ({ icon, title, link, onClick, className }) => {
  return (
    <Link
      href={link}
      scroll={false}
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition hover:cursor-pointer hover:bg-washed dark:hover:bg-washed-dark md:py-[6px]",
        className,
      ].join(" ")}
    >
      {icon}
      {title}
    </Link>
  );
};

export default NavItem;
