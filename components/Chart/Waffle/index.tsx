import { FunctionComponent, ReactElement } from "react";
import { ResponsiveWaffle, WaffleDatum, WaffleFillDirection } from "@nivo/waffle";
import { Box, Colors } from "@nivo/core";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import { useTheme } from "next-themes";
interface WaffleProps extends ChartHeaderProps {
  className?: string;
  data?: WaffleDatum[];
  total?: number;
  padding?: number;
  color?: Colors;
  rows?: number;
  cols?: number;
  margin?: Box;
  children?: ReactElement | ReactElement[];
  fillDirection?: WaffleFillDirection;
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
  margin = { top: 10, right: 0, bottom: 10, left: -20 },
  children,
  fillDirection = "bottom",
  interactive = false,
}) => {
  const { theme } = useTheme();
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
          emptyColor={theme === "light" ? "#f1f5f9" : "#27272a"}
          margin={margin}
          colors={color}
          animate={false}
          fillDirection={fillDirection}
          isInteractive={interactive}
        />
      </div>
      {children}
    </div>
  );
};

const dummy: WaffleDatum[] = [
  {
    id: "men",
    label: "men",
    value: 9.699015247221036,
  },
];

export default Waffle;
