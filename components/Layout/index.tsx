import { FunctionComponent, ReactElement } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  className?: string;
  stateSelector?: ReactElement;
  children: React.ReactNode;
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
