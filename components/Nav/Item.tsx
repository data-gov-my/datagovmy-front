import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useRouter } from "next/router";

type NavItemProps = {
  icon?: JSX.Element;
  title: string;
  link: string;
  onClick: () => void;
  className?: string;
};

const NavItem: FunctionComponent<NavItemProps> = ({ icon, title, link, onClick, className }) => {
  const { pathname } = useRouter();
  return (
    <Link
      href={link}
      scroll={false}
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-none px-2 py-2 text-sm font-medium transition hover:cursor-pointer hover:bg-washed dark:hover:bg-washed-dark md:rounded-md md:py-[6px]",
        pathname.startsWith(link) && link !== "/" ? "bg-washed dark:bg-washed-dark" : "",
        className,
      ].join(" ")}
    >
      {icon}
      {title}
    </Link>
  );
};

export default NavItem;
