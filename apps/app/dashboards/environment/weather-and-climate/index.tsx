import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { METIcon } from "@components/Icon/agency";

/**
 * WeatherandClimate Dashboard
 * @overview Status: In-development
 */

interface WeatherandClimateProps {}

const WeatherandClimate: FunctionComponent<WeatherandClimateProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-weather-and-climate", "common"]);

  return (
    <>
      <Hero
        background="green"
        category={[t("common:nav.megamenu.categories.environment"), "text-[#16A34A]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Metereology Department"}
            link="https://www.met.gov.my/?lang=en"
            icon={<METIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default WeatherandClimate;
