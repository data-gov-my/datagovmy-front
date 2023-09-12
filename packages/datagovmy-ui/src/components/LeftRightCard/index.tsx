import { FunctionComponent, ReactNode } from "react";
import { clx } from "../../lib/helpers";

interface CardProps {
  left: ReactNode;
  right: ReactNode;
  leftBg?: string;
  rightBg?: string;
}

/**
 * Left = description
 * Right = interactive area
 * @param left
 * @param right
 * @returns
 */

const LeftRightCard: FunctionComponent<CardProps> = ({
  left,
  right,
  leftBg = "dark:bg-washed-dark/50",
  rightBg = "bg-background dark:bg-black",
}) => {
  return (
    <>
      <div className="border-outline dark:border-washed-dark flex flex-col items-stretch overflow-visible rounded-xl border lg:flex-row">
        <div
          className={clx(
            "border-outline dark:border-washed-dark w-full overflow-visible lg:w-1/3 lg:border-r",
            leftBg
          )}
        >
          {left}
        </div>
        <div className={clx("w-full rounded-b-xl lg:w-2/3 lg:rounded-r-xl", rightBg)}>{right}</div>
      </div>
    </>
  );
};

export default LeftRightCard;
