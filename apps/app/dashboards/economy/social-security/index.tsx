import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { SOCSOIcon } from "@components/Icon/agency";

/**
 * SocialSecurity Dashboard
 * @overview Status: In-development
 */

interface SocialSecurityProps {}

const SocialSecurity: FunctionComponent<SocialSecurityProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-social-security", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("nav.megamenu.categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("dashboard-social-security:header")]}
        description={[t("dashboard-social-security:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Social Security Organisation (SOCSO)"}
            link="https://www.perkeso.gov.my/en/"
            icon={<SOCSOIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default SocialSecurity;
