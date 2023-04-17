import { FunctionComponent, ReactNode } from "react";

import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";

interface LayoutProps {
  className?: string;
  stateSelector?: ReactNode;
  children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ className, children, stateSelector }) => {
  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="pt-14">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
