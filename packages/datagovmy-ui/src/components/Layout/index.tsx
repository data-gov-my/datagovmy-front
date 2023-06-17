import { FunctionComponent, ReactNode } from "react";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

interface LayoutProps {
  className?: string;
  stateSelector?: ReactNode;
  children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ className, children, stateSelector }) => {
  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-grow flex-col pt-14">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
