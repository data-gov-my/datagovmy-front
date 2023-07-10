import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MERSIcon } from "@components/Icon/agency";

/**
 * Tracker999 Dashboard
 * @overview Status: In-development
 */

interface Tracker999Props {}

const Tracker999: FunctionComponent<Tracker999Props> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-999-tracker", "common"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.healthcare"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Emergency Response System (MERS)"}
            link="https://999.gov.my/"
            icon={<MERSIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Tracker999;