import { ElectionResult } from "@dashboards/democracy/election-explorer/types";
import { FunctionComponent } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";

interface ResultBadgeProps {
  value: ElectionResult | undefined;
  hidden?: boolean;
}

export const ResultBadge: FunctionComponent<ResultBadgeProps> = ({ value, hidden = false }) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  switch (value) {
    case "won":
    case "won_uncontested":
      return <Won desc={!hidden && t(`candidate.${value}`)} />;
    case "lost":
    case "lost_deposit":
      return <Lost desc={!hidden && t(`candidate.${value}`)} />;
    default:
      return <></>;
  }
};

interface WonProps {
  desc?: string | false;
}

export const Won: FunctionComponent<WonProps> = ({ desc }) => {
  return (
    <span className="flex flex-row items-center gap-1.5">
      <CheckCircleIcon className="h-4 w-4 self-center text-[#10B981]" />
      {desc && <span className="whitespace-nowrap uppercase text-[#10B981]">{desc}</span>}
    </span>
  );
};

interface LostProps {
  desc?: string | false;
}

export const Lost: FunctionComponent<LostProps> = ({ desc }) => {
  return (
    <span className="flex flex-row items-center gap-1.5">
      <XCircleIcon className="text-danger h-4 w-4 self-center" />
      {desc && <span className="text-danger whitespace-nowrap uppercase">{desc}</span>}
    </span>
  );
};