import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

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
        category={[t("common:categories.environment"), "text-[#16A34A]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="met" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default WeatherandClimate;
