import { FunctionComponent, ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
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
  useBanner = false,
}) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Header stateSelector={stateSelector} />
      <div className="flex min-h-screen flex-col">
        {useBanner && (
          <div className="w-full bg-primary mt-14">
            <Container>
              <div className="flex max-w-screen-2xl gap-2 py-4 text-white">
                <InformationCircleIcon className="shrink-0 size-5 text-white" />
                <Markdown className="banner-markdown">
                  {t("common:common.opendosm_banner")}
                </Markdown>
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
