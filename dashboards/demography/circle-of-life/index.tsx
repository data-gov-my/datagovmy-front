import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

interface CircleofLifeProps {}

const CircleofLife: FunctionComponent<CircleofLifeProps> = ({}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Hero
        background="gray"
        category={["Demography"]}
        header={["Circle of Life"]}
        description={[
          "There are 4 major demographic milestones in a person's life - the day they are born, the day they get married (and possibly divorced), the day they have children, and the day they die. This dashboard tracks these 4 milestones for the Malaysian population, giving you a sweeping overview of the nation’s demographics. At what age do Malaysians get married? How many children do they have? How has life expectancy changed over the years? Jump in and find out more below!",
        ]}
        agencyBadge={
          <AgencyBadge
            agency={"National Registration Department"}
            link="https://www.bnm.gov.my/publications/mhs"
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default CircleofLife;
