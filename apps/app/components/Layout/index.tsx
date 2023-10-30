import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import { FunctionComponent, ReactNode } from "react";
import { Container, Markdown } from "datagovmy-ui/components";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";

interface LayoutProps {
  className?: string;
  stateSelector?: ReactNode;
  children: ReactNode;
  useBanner?: boolean;
}

const Layout: FunctionComponent<LayoutProps> = ({
  className,
  children,
  stateSelector,
  useBanner = true,
}) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="flex min-h-screen flex-col">
        {useBanner && (
          <Container className="bg-primary pt-14">
            <div className="flex items-start gap-2 py-4 text-white">
              <div className="w-full max-w-[20px]">
                <InformationCircleIcon className="h-[20px] w-[20px] text-white" />
              </div>
              <Markdown className="banner-markdown">{t("common:common.banner")}</Markdown>
            </div>
          </Container>
        )}
        <div className={clx("flex flex-grow flex-col", useBanner ? "" : "pt-14")}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
