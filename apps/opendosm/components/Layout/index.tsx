import { FunctionComponent, ReactElement } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  stateSelector?: ReactElement;
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children, stateSelector }) => {
  return (
    <>
      <Header stateSelector={stateSelector} />
      <div className="pt-14">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
