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
  mysIndex?: number;
}

const RankList: FunctionComponent<RankListProps> = ({
  id,
  title,
  data,
  threshold = 3,
  reverse = true,
  color,
  format,
  mysIndex,
}) => {
  const hasMsia = mysIndex !== undefined && mysIndex !== -1;
  const topStateIndices = getTopIndices(
    data,
    threshold !== null ? threshold : data.length,
    reverse,
    mysIndex
  );

  return (
    <>
      <div className="dark:border-outlineHover-dark border-t pb-1.5 pt-6">
        <p className="font-bold">{title}</p>
      </div>
      {hasMsia ? (
        <div
          className="mr-4.5 pb-1.5 flex gap-3 shrink-0 overflow-y-hidden [scrollbar-gutter:stable]"
          data-testid={`${id}-li-0`}
        >
          <p className="flex justify-center text-dim font-medium w-7">—</p>
          <p className="block grow">{format(mysIndex).label}</p>
          <p className={clx("font-bold tabular-nums", color ?? "text-dim")}>
            {format(mysIndex).value}
          </p>
        </div>
      ) : (
        <></>
      )}
      <ul
        className="overflow-auto pt-1.5 [mask-image:linear-gradient(to_bottom,transparent,#000_5%,#000_95%,transparent),linear-gradient(to_left,#000,transparent_0%)]"
        data-testid={id || title}
      >
        {topStateIndices.slice(hasMsia ? 1 : 0).map((pos, i) => (
          <li className="mr-4.5 flex gap-3 pb-3" key={pos} data-testid={`${id}-li-${i + 1}`}>
            <p
              className={clx("flex justify-center text-dim font-medium", i >= 99 ? "w-max" : "w-7")}
            >
              #{i + 1}
            </p>
            <p className="block grow">{format(pos).label}</p>
            <p className={clx("font-bold tabular-nums", color ?? "text-dim")}>
              {format(pos).value}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RankList;
