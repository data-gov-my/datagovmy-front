import { FunctionComponent } from "react";
import { Container, Hero, Section } from "@components/index";
import dynamic from "next/dynamic";
import { useTranslation } from "@hooks/useTranslation";
import AgencyBadge from "@components/AgencyBadge";
import { JabatanPendaftaranNegaraIcon } from "@components/Icon";
import BarMeter from "@components/Chart/BarMeter";
import Card from "@components/Card";

/**
 * Name Popularity Dashboard
 * @overview Status: Live
 */

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface NamePopularityDashboardProps {
  data: { name: string; total: number; decade: number[]; count: number[] };
}

const NamePopularityDashboard: FunctionComponent<NamePopularityDashboardProps> = ({ data }) => {
  const { t, i18n } = useTranslation(["common", "dashboard-name-popularity"]);

  const barData = data.decade.map((x, i) => ({ x: x.toString(), y: data.count[i] }));
  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-[#A1BFFF] to-background dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-name-popularity:header")]}
        description={[t("dashboard-name-popularity:description")]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={<JabatanPendaftaranNegaraIcon />}
          />
        }
      />
      <Container className="min-h-screen">
        <Section>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Card>
                <span>Search for:</span>
              </Card>
            </div>
            <div className="col-span-3">
              <BarMeter
                title={t("dashboard-name-popularity:bar_title", {
                  name: data.name,
                  total: data.total,
                })}
                data={barData}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default NamePopularityDashboard;
