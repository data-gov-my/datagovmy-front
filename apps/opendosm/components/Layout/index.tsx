import { FunctionComponent, ReactElement, ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  stateSelector?: ReactNode;
  className?: string;
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
