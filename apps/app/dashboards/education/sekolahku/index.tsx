import AgencyBadge from "@components/AgencyBadge";
import { Hero, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOEIcon } from "@components/Icon/agency";
import ComboBox from "@components/Combobox";

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
      <Container className="min-h-screen">
        <Section>
          <div className="space-y-6">
            <h4 className="text-center">{t("section_1")}</h4>
            <div className="flex items-center justify-center">
              <ComboBox
                placeholder={t("search_school")}
                options={[]}
                selected={null}
                onChange={e => {
                  null;
                }}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default Sekolahku;
