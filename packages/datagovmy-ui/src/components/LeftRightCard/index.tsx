import { FunctionComponent, ReactNode } from "react";

interface CardProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * Left = description
 * Right = interactive area
 * @param param0
 * @returns
 */

const LeftRightCard: FunctionComponent<CardProps> = ({ left, right }) => {
  return (
    <>
      <div className="flex flex-col items-stretch overflow-visible rounded-xl border border-slate-200 dark:border-zinc-800 lg:flex-row">
        <div className="basis-1/3 overflow-visible border-slate-200 dark:border-zinc-800 dark:bg-zinc-800/50 lg:border-r">
          {left}
        </div>
        <div className="basis-2/3 rounded-b-xl bg-slate-50 dark:bg-zinc-900 lg:rounded-r-xl">
          {right}
        </div>
      </div>
    </>
  );
};

export default LeftRightCard;
