import { At, Header, Nav, Megamenu } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const KKMNOWHeader: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation(["dashboards"]);

  return (
    <Header>
      <Nav stateSelector={stateSelector}>
        {close => (
          <>
            <Nav.Item title={t("common:nav.home")} link="/" onClick={close} />
            <Nav.Item title={t("common:nav.catalogue")} link="/data-catalogue" onClick={close} />
          </>
        )}
      </Nav>
    </Header>
  );
};

export default KKMNOWHeader;
