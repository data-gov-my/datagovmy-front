import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOEIcon } from "@components/Icon/agency";

/**
 * Sekolahku Dashboard
 * @overview Status: In-development
 */

interface SekolahkuProps {}

const Sekolahku: FunctionComponent<SekolahkuProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-sekolahku", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("common:nav.megamenu.categories.education"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Education (MoE)"}
            link="https://www.moe.gov.my/"
            icon={<MOEIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Sekolahku;
