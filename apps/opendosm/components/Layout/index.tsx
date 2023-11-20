import { FunctionComponent, ReactElement, ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";
import { useTranslation } from "datagovmy-ui/hooks";
import { Container, Markdown } from "datagovmy-ui/components";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { clx } from "datagovmy-ui/helpers";

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
          <div className="w-full bg-primary pt-14">
            <Container className="">
              <div className="flex max-w-screen-2xl items-start gap-2 py-4 text-white">
                <div className="w-full max-w-[20px]">
                  <InformationCircleIcon className="h-[20px] w-[20px] text-white" />
                </div>
                <Markdown className="banner-markdown">{t("common:common.banner")}</Markdown>
              </div>
            </Container>
          </div>
        )}
        <div className={clx("flex flex-grow flex-col", useBanner ? "" : "pt-14")}>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
