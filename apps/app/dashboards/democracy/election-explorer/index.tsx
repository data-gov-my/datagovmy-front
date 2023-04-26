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

interface ElectionExplorerProps {
  election: any;
  candidate: any;
  party: any;
  seat: any;
}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({
  election,
  candidate,
  party,
  seat,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const PANELS = [
    {
      name: t("elections"),
      icon: <SPRIconSolid className="-mb-1" />,
      data: <Election election={election} />,
    },
    {
      name: t("candidates"),
      icon: <UserIcon className="m-1 h-5 w-5" />,
      data: <ElectionCandidates candidate={candidate} />,
    },
    {
      name: t("parties"),
      icon: <FlagIcon className="m-1 h-5 w-5" />,
      data: <ElectionParties party={party} />,
    },
    {
      name: t("seats"),
      icon: <MapIcon className="m-1 h-5 w-5" />,
      data: <ElectionSeats seat={seat} />,
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
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Election Comission (EC)"}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />

      <Container className="min-h-fit">
        <ContainerTabs current={data.tabs} onChange={index => setData("tabs", index)}>
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
