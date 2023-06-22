import { FunctionComponent, ReactElement } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  stateSelector?: ReactElement;
  className?: string;
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children, stateSelector, className }) => {
  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="pt-14">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
