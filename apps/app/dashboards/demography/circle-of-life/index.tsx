import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

/**
 * Circle of Life Dashboard
 * @overview Status: In-development
 */

interface CircleofLifeProps {}

const CircleofLife: FunctionComponent<CircleofLifeProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-circle-of-life", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="jpn" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default CircleofLife;
