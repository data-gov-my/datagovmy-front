import { AxisTickProps } from "@nivo/axes";

const DefaultTick = (tick: AxisTickProps<string>) => {
  return (
    <g transform={`translate(${tick.x - 120},${tick.y})`}>
      <text
        textAnchor="start"
        dominantBaseline="middle"
        style={{
          fontSize: "14px",
          textAlign: "left",
        }}
      >
        {tick.value}
      </text>
    </g>
  );
};

export default DefaultTick;
