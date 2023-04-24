import { FunctionComponent } from "react";
import AgencyBadge from "@components/AgencyBadge";
import Hero from "@components/Hero";
import Container from "@components/Container";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import Election from "./elections";
import ElectionCandidates from "./candidates";
import ElectionParties from "./political-parties";
import ElectionSeats from "./seats";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

interface ElectionExplorerProps {}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const PANELS = [
    {
      name: t("dashboard-election-explorer:elections"),
      icon: <SPRIconSolid className="-mb-1" />,
      data: <Election />,
    },
    {
      name: t("dashboard-election-explorer:candidates"),
      icon: <UserIcon className="m-1 h-5 w-5" />,
      data: <ElectionCandidates />,
    },
    {
      name: t("dashboard-election-explorer:parties"),
      icon: <FlagIcon className="m-1 h-5 w-5" />,
      data: <ElectionParties />,
    },
    {
      name: t("dashboard-election-explorer:seats"),
      icon: <MapIcon className="m-1 h-5 w-5" />,
      data: <ElectionSeats />,
    },
  ];
  const { data, setData } = useData({
    tabs: 0,
  });
  return (
    <>
      <Hero
        background="red"
        category={[t("common:nav.megamenu.categories.democracy"), "text-danger"]}
        header={[t("dashboard-election-explorer:header")]}
        description={[t("dashboard-election-explorer:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Election Comission (EC)"}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />

      <Container className="min-h-fit">
        <ContainerTabs current={data.tabs}>
          {PANELS.map((panel, index) => (
            <ContainerTabs.Panel name={panel.name} icon={panel.icon} key={index}>
              {panel.data}
            </ContainerTabs.Panel>
          ))}
        </ContainerTabs>
      </Container>
    </>
  );
};

export default ElectionExplorer;
