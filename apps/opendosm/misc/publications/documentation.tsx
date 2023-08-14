import { Container, Panel, Section, Tabs } from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";
/**
 * Documentations
 * @overview Status: In-development
 */

interface DocumentationProps {}

const DocsPublicationsDashboard: FunctionComponent<DocumentationProps> = ({}) => {
  const { t } = useTranslation(["publications", "common"]);

  const { data, setData } = useData({
    tab_index: 0,
  });

  return (
    <Container className="min-h-screen">
      <Section>
        <Tabs className="pb-8" title={<h4>{t("documentation")}</h4>}>
          <Panel name={t("technical_notes")} key={"technical_notes"}></Panel>
          <Panel name={t("data_dictionary")} key={"data_dictionary"}></Panel>
        </Tabs>
      </Section>
    </Container>
  );
};

export default DocsPublicationsDashboard;
