import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { NTRCIcon } from "@components/Icon/agency";

/**
 * OrganDonation Dashboard
 * @overview Status: In-development
 */

interface OrganDonationProps {}

const OrganDonation: FunctionComponent<OrganDonationProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-organ-donation"]);

  return (
    <>
      <Hero
        background="green"
        category={[t("nav.megamenu.categories.healthcare"), "text-[#16A34A]"]}
        header={[t("dashboard-organ-donation:header")]}
        description={[t("dashboard-organ-donation:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"National Transplant Resource Centre (NTRC)"}
            link="https://www.dermaorgan.gov.my/ntrc"
            icon={<NTRCIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default OrganDonation;
