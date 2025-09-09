import { FunctionComponent, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Banner } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";

interface LayoutProps {
  className?: string;
  stateSelector?: ReactNode;
  children: ReactNode;
  banner?: {
    namespace: string;
    key: string;
    className?: string;
  };
}
const Layout: FunctionComponent<LayoutProps> = ({ className, children, stateSelector, banner }) => {
  const { t } = useTranslation(banner?.namespace);
  const useBanner = Boolean(t(banner?.key || ""));

  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="flex min-h-screen flex-col">
        {useBanner && <Banner className={banner?.className} text={t(banner?.key || "")} />}
        <div className={clx("flex flex-grow flex-col", useBanner ? "" : "pt-14")}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
