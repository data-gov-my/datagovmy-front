import { clx, getTopIndices } from "../../../lib/helpers";
import { FunctionComponent } from "react";

interface RankListProps {
  id?: string;
  title: string;
  data: number[];
  threshold: number | null;
  reverse?: boolean;
  color?: string;
  format: (position: number) => { label: string; value: string };
}

const RankList: FunctionComponent<RankListProps> = ({
  id,
  title,
  data,
  threshold = 3,
  reverse = true,
  color,
  format,
}) => {
  const topStateIndices = getTopIndices(
    data,
    threshold !== null ? threshold : data.length,
    reverse
  );

  return (
    <>
      <div className="dark:border-outlineHover-dark border-t pb-3 pt-6">
        <p className="font-bold">{title}</p>
      </div>
      <ul className="space-y-3 overflow-auto" data-testid={id || title}>
        {topStateIndices.map((pos, i) => {
          return (
            <li className="mr-4.5 flex space-x-3" key={pos} data-testid={`${id}-li-${i}`}>
              <p className="text-dim font-medium">#{i + 1}</p>
              <p className="block grow">{format(pos).label}</p>
              <p className={clx("font-bold tabular-nums", color ?? "text-dim")}>
                {format(pos).value}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RankList;
