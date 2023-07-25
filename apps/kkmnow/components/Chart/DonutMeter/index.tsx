import { FunctionComponent } from "react";

interface DonutMeterProps {
  value?: number;
}

const DonutMeter: FunctionComponent<DonutMeterProps> = ({ value = 30 }) => {
  const color = () => {
    if (value >= 90) return "#DC2626";
    if (value >= 75) return "#FB8229";
    if (value >= 50) return "#FBBF24";
    else return "#22C55E";
  };
  return (
    <figure
      className="donut-meter relative min-h-[56px] min-w-[56px] rounded-[50%] bg-white"
      role={"progressbar"}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        backgroundImage: `conic-gradient(${color()} 0turn, ${color()} ${(value / 100).toFixed(
          2
        )}turn, rgb(226 232 240) ${(value / 100).toFixed(2)}turn, rgb(226 232 240)  1turn)`,
      }}
    />
  );
};

export default DonutMeter;
