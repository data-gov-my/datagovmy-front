import { At } from "datagovmy-ui/components";
import React, { FunctionComponent } from "react";

type NavItemProps = {
  icon?: JSX.Element;
  title: string;
  link: string;
};

const NavItem: FunctionComponent<NavItemProps> = ({ icon, title, link }) => {
  return (
    <At href={link} scroll={false}>
      <div className="flex items-center gap-2 rounded-md bg-white px-2 py-2 text-sm font-medium hover:cursor-pointer hover:bg-washed md:py-[6px]">
        {icon}
        {title}
      </div>
    </At>
  );
};

export default NavItem;
