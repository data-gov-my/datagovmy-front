import { Container, Section, Tabs } from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent } from "react";
/**
 * Documentations
 * @overview Status: In-development
 */

interface DocumentationProps {}

const DocsPublicationsDashboard: FunctionComponent<DocumentationProps> = ({}) => {
  const { t } = useTranslation(["publications", "common"]);

  const TABS: OptionType[] = [
    { label: t("absolute"), value: "abs" },
    { label: t("relative"), value: "relative" },
  ];

  const { data, setData } = useData({
    tab_index: 0,
    tab_type: TABS[0],
  });

  return (
    <Container className="min-h-screen">
      <Section
        title={t("documentation")}
        menu={
          <Tabs.List
            options={[t("absolute"), t("relative")]}
            current={data.tab_index}
            onChange={index => {
              setData("tab_index", index);
              setData("tab_type", TABS[index]);
            }}
          />
        }
      ></Section>
    </Container>
  );
};

export default DocsPublicationsDashboard;
