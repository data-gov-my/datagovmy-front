import { FunctionComponent, ReactNode } from "react";

import Link from "next/link";
import Image from "next/image";

interface LayoutProps {
  className?: string;
  children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ className, children }) => {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <main className="flex-auto">{children}</main>
    </div>
  );
};

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <div className="border-washed-dark z-30 w-full border-b bg-black p-4 ">
      <div className="flex w-full items-center gap-4">
        <Link href="/">
          <div className="flex cursor-pointer gap-2">
            <div className="flex w-8 items-center justify-center">
              <Image src="/logo.png" width={48} height={36} alt="datagovmy_logo" />
            </div>
            <h4>the transl8tor</h4>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default Layout;
