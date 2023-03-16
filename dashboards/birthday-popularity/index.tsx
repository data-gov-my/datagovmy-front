import { FunctionComponent, useCallback } from "react";
import {
  Container,
  Dropdown,
  Hero,
  Panel,
  Section,
  Tabs,
  StateDropdown,
  Button,
} from "@components/index";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWindowWidth } from "@hooks/useWindowWidth";
import AgencyBadge from "@components/AgencyBadge";
import Slider from "@components/Chart/Slider";
import {
  ArrowPathIcon,
  IdentificationIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/solid";

/**
 * Birthday Popularity Dashboard
 * @overview Status: Live
 */

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface BirthdayPopularityDashboardProps {
  // bar: any;
}

const BirthdayPopularityDashboard: FunctionComponent<BirthdayPopularityDashboardProps> = (
  {
    // bar,
  }
) => {
  const { t, i18n } = useTranslation(["common", "dashboard-birthday-popularity"]);
  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-[#A1BFFF] to-background dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-birthday-popularity:header")]}
        description={[t("dashboard-birthday-popularity:description")]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={<IdentificationIcon className="h-8 w-8 text-primary" />}
          />
        }
      />
      {/* <SearchIcon className="h-4 w-4 text-dim" /> */}
    </>
  );
};

export default BirthdayPopularityDashboard;
