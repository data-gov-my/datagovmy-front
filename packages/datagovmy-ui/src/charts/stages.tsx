import { FunctionComponent, ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
import { clx, numFormat } from "../lib/helpers";

/**
 * Stages
 */
type StagesProps = ChartHeaderProps & {
  className?: string;
  data?: StageData;
};

type StageData = {
  header: StatsProps;
  col_1: StatsProps[];
  col_2: StatsProps[];
  col_3: StatsProps[];
};

const Stages: FunctionComponent<StagesProps> = ({
  title,
  className = "",
  menu,
  controls,
  data,
}) => {
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        {/* Header */}
        {data?.header && (
          <div className="bg-washed dark:bg-washed-dark m-auto w-fit min-w-[200px] rounded px-3 py-1.5 text-center">
            <span className="text-dim text-xs">{data.header.name}</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl dark:text-white">
                {numFormat(data.header.value, "standard")}
              </span>

              <small
                className={clx(
                  "inline-block rounded bg-opacity-20 px-1.5",
                  badgeColor(data.header.delta, data.header.inverse)
                )}
              >
                {appendPlusMinus(data.header.delta)}
                {numFormat(data.header.delta, "standard")}
              </small>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="mt-6 grid h-full grid-cols-1 lg:grid-cols-3">
          {/* Col-1 */}
          <ul className="m-auto space-y-10">
            {data?.col_1.map(({ name, icon, value, delta, unit, inverse }: StatsProps) => {
              return (
                value && (
                  <li key={name}>
                    <Stats
                      name={name}
                      value={value}
                      delta={delta}
                      icon={icon}
                      unit={unit}
                      inverse={inverse}
                    />
                  </li>
                )
              );
            })}
          </ul>
          {/* Col-2 */}
          <div className="flex flex-col justify-center lg:flex-row">
            <Bracket
              arrowLeft={
                <div className="flex h-full w-full items-center justify-center lg:w-auto">
                  <ArrowRightIcon className="text-dim my-3 h-5 w-5 rotate-90 lg:mr-3 lg:rotate-0" />
                </div>
              }
            />
            <div className="w-full lg:flex-grow">
              <ul className="flex flex-row flex-wrap justify-evenly gap-12 py-7 lg:mx-auto lg:block lg:w-fit lg:gap-0 lg:space-y-10 lg:py-0">
                {data?.col_2.map(({ name, icon, value, delta, unit, inverse }: StatsProps) => {
                  return (
                    value !== null && (
                      <li key={name}>
                        <Stats
                          name={name}
                          value={value}
                          delta={delta}
                          icon={icon}
                          unit={unit}
                          iconPlacement="left"
                          inverse={inverse}
                        />
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
            <Bracket
              className="rotate-180"
              arrowRight={
                <div className="flex h-full flex-row justify-evenly pl-3 lg:flex-col">
                  <ArrowRightIcon className="text-dim my-3 h-5 w-5 rotate-90 lg:mr-3 lg:rotate-0" />
                  <ArrowRightIcon className="text-dim my-3 h-5 w-5 rotate-90 lg:mr-3 lg:rotate-0" />
                </div>
              }
            />
          </div>
          {/* Col-3 */}
          <ul className="m-auto space-y-10">
            {data?.col_3.map(({ name, icon, value, delta, unit, inverse }: StatsProps) => {
              return (
                value && (
                  <li key={name}>
                    <Stats
                      name={name}
                      value={value}
                      delta={delta}
                      icon={icon}
                      unit={unit}
                      inverse={inverse}
                    />
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Stats
 */

interface StatsProps {
  className?: string;
  name: string;
  icon?: ReactNode;
  iconPlacement?: "top" | "left";
  value: number;
  delta: number;
  unit?: string;
  inverse?: boolean;
}

const Stats: FunctionComponent<StatsProps> = ({
  className = "",
  name,
  icon,
  iconPlacement = "top",
  value,
  delta = 0,
  unit = undefined,
  inverse = false,
}) => {
  return (
    <div
      className={clx(
        "flex",
        className,
        iconPlacement === "top"
          ? "flex-col items-center space-y-4"
          : "flex-col items-center lg:flex-row lg:items-start lg:space-x-4"
      )}
    >
      {icon && icon}
      <div
        className={clx(
          "flex flex-col",
          iconPlacement === "top" ? "items-center" : "items-center lg:items-start"
        )}
      >
        <span className="text-dim text-xs">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{value && numFormat(value, "standard")}</span>
          <small
            className={clx(
              "inline-block rounded px-1.5",
              !unit
                ? badgeColor(delta, inverse).concat(" bg-opacity-20")
                : "bg-washed dark:bg-washed-dark text-gray-500"
            )}
          >
            {!unit && appendPlusMinus(delta)}
            {delta && numFormat(delta, "standard", 1)}
            {unit}
          </small>
        </div>
      </div>
    </div>
  );
};

const appendPlusMinus = (delta: number) => {
  return delta > 0 ? "+" : "";
};

const badgeColor = (delta: number, inverse: boolean = false) => {
  if (inverse) {
    return delta > 0 ? "bg-red-400 text-red-500" : "bg-green-400 text-green-500";
  }

  return delta > 0 ? "bg-green-400 text-green-500" : "bg-red-400 text-red-500";
};

/**
 * Bracket
 */
interface BracketProps {
  className?: string;
  arrowLeft?: ReactNode;
  arrowRight?: ReactNode;
}

const Bracket: FunctionComponent<BracketProps> = ({ className = "", arrowLeft, arrowRight }) => {
  return (
    <>
      {arrowLeft && arrowLeft}
      <div className={`relative ${className}`}>
        <div className="bg-outline dark:bg-outlineHover-dark h-1 lg:h-full lg:w-1" />
        <div className="bg-outline dark:bg-outlineHover-dark absolute left-0 top-0 h-2 w-1 rounded-xl lg:h-1 lg:w-2" />
        <div className="bg-outline dark:bg-outlineHover-dark absolute bottom-0 right-0 top-0 h-2 w-1 lg:left-0 lg:top-full lg:h-1 lg:w-2" />
      </div>
      {arrowRight && arrowRight}
    </>
  );
};

export default Stages;
