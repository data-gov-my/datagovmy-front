import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, ReactNode } from "react";
import Container from "../Container";
import getConfig from "next/config";

interface HeaderProps {
  children: ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ children }) => {
  const { publicRuntimeConfig } = getConfig();

  return (
    <div className="dark:border-washed-dark fixed left-0 top-0 z-30 w-full border-b">
      <Container background="bg-white dark:bg-black" className="flex items-center gap-4 py-[11px]">
        <div className="flex w-full items-center gap-4">
          <Link href="/">
            <div className="flex cursor-pointer gap-2">
              <div className="flex w-8 items-center justify-center">
                <Image src="/static/images/logo.png" width={48} height={36} alt="datagovmy_logo" />
              </div>
              <h4>{publicRuntimeConfig.APP_NAME}</h4>
            </div>
          </Link>
          {children}
        </div>
      </Container>
    </div>
  );
};

export default Header;
