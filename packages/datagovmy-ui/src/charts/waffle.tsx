import { FunctionComponent, ReactElement } from "react";
import { ResponsiveWaffle, WaffleFillDirection } from "@nivo/waffle";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
import { useTheme } from "next-themes";
interface WaffleProps extends ChartHeaderProps {
  className?: string;
  data?: {
    id: string | number;
    value: number;
    label: string | number;
  }[];
  total?: number;
  padding?: number;
  color?: string | string[];
  rows?: number;
  cols?: number;
  margin?: {
    bottom?: number | undefined;
    left?: number | undefined;
    right?: number | undefined;
    top?: number | undefined;
  };
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
  const { theme = "light" } = useTheme();
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
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

const dummy = [
  {
    id: "men",
    label: "men",
    value: 9.699015247221036,
  },
];

export default Waffle;
