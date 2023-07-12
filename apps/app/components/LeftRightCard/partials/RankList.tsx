import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { clx, getTopIndices } from "@lib/helpers";
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
    <div className="dark:border-outlineHover-dark border-t pt-6">
      <p className="font-bold">{title}</p>
      <ul className="space-y-3 pt-3" data-testid={id || title}>
        {topStateIndices.map((pos, i) => {
          return (
            <li className="flex space-x-3" key={pos} data-testid={`${id}-li-${i}`}>
              <p className="text-dim font-medium">#{i + 1}</p>
              <p className="block grow">{format(pos).label}</p>
              <p className={clx("font-bold", color ?? "text-dim")}>{format(pos).value}</p>
              <ArrowRightIcon className="text-dim h-4 w-4 self-center stroke-[1.5px]" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RankList;
