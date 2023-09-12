import { Container, Nav } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation("common");

  return (
    <div className="dark:border-washed-dark fixed left-0 top-0 z-30 w-full border-b">
      <Container background="bg-white dark:bg-black" className="flex items-center gap-4 py-[11px]">
        <div className="flex w-full items-center gap-4">
          <Link href="/">
            <div className="flex cursor-pointer gap-2">
              <div className="flex w-8 items-center justify-center">
                <Image src="/static/images/logo.png" width={48} height={36} alt="datagovmy_logo" />
              </div>
              <h4>data.gov.my</h4>
            </div>
          </Link>

          <Nav stateSelector={stateSelector}>
            {close => (
              <>
                <Nav.Item key={"/"} title={t("common:nav.home")} link="/" onClick={close} />
                <Nav.Item
                  title={t("common:nav.dashboards")}
                  link="/dashboard"
                  key="/dashboard"
                  onClick={close}
                />
                <Nav.Item
                  title={t("common:nav.catalogue")}
                  key="/data-catalogue"
                  link="/data-catalogue"
                  onClick={close}
                />
                <Nav.Item
                  title={t("common:nav.api_docs")}
                  key="api_docs"
                  link="https://developer.data.gov.my"
                  onClick={close}
                  external
                />
                <Nav.Item
                  title={t("common:nav.community")}
                  key="/community"
                  link="/community"
                  onClick={close}
                />
                <Nav.Item
                  title={t("common:nav.helpdesk")}
                  key="/helpdesk"
                  link="/helpdesk"
                  onClick={close}
                />
                <Nav.Item
                  title={t("common:nav.legacy")}
                  key="/legacy"
                  link="https://archive.data.gov.my"
                  onClick={close}
                  external
                />
              </>
            )}
          </Nav>
        </div>
      </Container>
    </div>
  );
};

export default Header;
