import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import { FunctionComponent, ReactNode } from "react";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";

interface LayoutProps {
  className?: string;
  stateSelector?: ReactNode;
  children: ReactNode;
  useBanner?: boolean;
}

const Layout: FunctionComponent<LayoutProps> = ({ className, children, stateSelector }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="flex min-h-screen flex-col">
        <div className={clx("flex flex-grow flex-col pt-14")}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
