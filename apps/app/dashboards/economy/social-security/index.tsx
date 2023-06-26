import AgencyBadge from "@components/Badge/agency";
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
        category={[t("common:categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:perkeso.full")}
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
