import { FunctionComponent, ReactNode } from "react";

interface CardProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * Left = description
 * Right = interactive area
 * @param left
 * @param right
 * @returns
 */

const LeftRightCard: FunctionComponent<CardProps> = ({ left, right }) => {
  return (
    <>
      <div className="flex flex-col items-stretch overflow-visible rounded-xl border border-slate-200 dark:border-zinc-800 lg:flex-row">
        <div className="w-full overflow-visible border-slate-200 dark:border-zinc-800 dark:bg-zinc-800/50 lg:w-1/3 lg:border-r">
          {left}
        </div>
        <div className="w-full rounded-b-xl bg-slate-50 dark:bg-zinc-900 lg:w-2/3 lg:rounded-r-xl">
          {right}
        </div>
      </div>
    </>
  );
};

export default LeftRightCard;
