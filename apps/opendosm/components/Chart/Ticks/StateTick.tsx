import { AxisTickProps } from "@nivo/axes";
import { CountryAndStates } from "@lib/constants";

const StateTick = (tick: AxisTickProps<string>) => {
  return (
    <g transform={`translate(${tick.x - 150},${tick.y})`}>
      <image
        x={-28}
        y={-6}
        href={`/static/images/states/${tick.value}.jpeg`}
        style={{ width: "18px" }}
      />
      <text
        textAnchor="start"
        dominantBaseline="middle"
        style={{
          fontSize: "14px",
          textAlign: "left",
        }}
      >
        {CountryAndStates[tick.value]}
      </text>
    </g>
  );
};

export default StateTick;
