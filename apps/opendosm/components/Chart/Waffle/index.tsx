import { FunctionComponent, ReactElement } from "react";
import { ResponsiveWaffle } from "@nivo/waffle";
import { Colors } from "@nivo/core";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
interface WaffleProps extends ChartHeaderProps {
  className?: string;
  data?: any;
  total?: number;
  padding?: number;
  color?: Colors;
  rows?: number;
  cols?: number;
  children?: ReactElement | ReactElement[];
  interactive?: boolean;
}

const Waffle: FunctionComponent<WaffleProps> = ({
  title,
  menu,
  controls,
  className,
  data = dummy,
  state,
  color = "#157857",
  total = 100,
  padding = 4,
  rows = 10,
  cols = 10,
  children,
  interactive = false,
}) => {
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <ResponsiveWaffle
          data={data}
          total={total}
          rows={rows}
          columns={cols}
          padding={padding}
          emptyColor="#F3F4F6"
          margin={{ top: 10, right: 0, bottom: 10, left: -20 }}
          colors={color}
          animate={false}
          isInteractive={interactive}
        />
      </div>
      {children}
    </div>
  );
};

const dummy = [
  {
    id: "men",
    label: "men",
    value: 9.699015247221036,
  },
];

export default Waffle;
