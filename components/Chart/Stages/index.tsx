import { FunctionComponent, ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";

/**
 * Stages
 */
interface StagesProps extends ChartHeaderProps {
  className?: string;
  data?: StageData;
}

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
  state,
}) => {
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        {/* Header */}
        {data?.header && (
          <div className="m-auto w-fit min-w-[200px] rounded bg-washed py-1.5 px-3 text-center">
            <span className="text-xs text-dim">{data.header.name}</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{data.header.value.toLocaleString()}</span>

              <small
                className={`inline-block rounded bg-opacity-20 px-1.5 ${badgeColor(
                  data.header.delta,
                  data.header.inverse
                )}`}
              >
                {appendPlusMinus(data.header.delta)}
                {data.header.delta}
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
                  <ArrowRightIcon className="my-3 h-5 w-5 rotate-90 text-dim lg:mr-3 lg:rotate-0" />
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
                  <ArrowRightIcon className="my-3 h-5 w-5 rotate-90 text-dim lg:mr-3 lg:rotate-0" />
                  <ArrowRightIcon className="my-3 h-5 w-5 rotate-90 text-dim lg:mr-3 lg:rotate-0" />
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
      className={`flex ${className} ${
        iconPlacement === "top"
          ? "flex-col items-center space-y-4"
          : "flex-col items-center lg:flex-row lg:items-start lg:space-x-4"
      }`}
    >
      {icon && icon}
      <div
        className={`flex flex-col ${
          iconPlacement === "top" ? "items-center" : "items-center lg:items-start"
        }`}
      >
        <span className="text-xs text-dim">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{value && value.toLocaleString()}</span>
          <small
            className={`inline-block rounded px-1.5 ${
              !unit
                ? badgeColor(delta, inverse).concat(" bg-opacity-20")
                : "bg-washed text-gray-500"
            }`}
          >
            {!unit && appendPlusMinus(delta)}
            {delta && (+delta.toFixed(1)).toLocaleString()}
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
        <div className="h-1 bg-outline lg:h-full lg:w-1" />
        <div className="absolute top-0 left-0 h-2 w-1 rounded-xl bg-outline lg:h-1 lg:w-2" />
        <div className="absolute bottom-0 top-0 right-0 h-2 w-1 bg-outline lg:top-full lg:left-0 lg:h-1 lg:w-2" />
      </div>
      {arrowRight && arrowRight}
    </>
  );
};

export default Stages;
