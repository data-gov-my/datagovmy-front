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
    <Link href={link} scroll={false}>
      <a
        className={[
          "flex items-center gap-2 rounded-md bg-white px-2 py-2 text-sm font-medium hover:cursor-pointer hover:bg-washed md:py-[6px]",
          className,
        ].join(" ")}
        onClick={onClick}
      >
        {icon}
        {title}
      </a>
    </Link>
  );
};

export default NavItem;
