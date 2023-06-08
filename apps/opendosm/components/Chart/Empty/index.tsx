import { FunctionComponent } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  ChartData,
  TimeScale,
  TimeSeriesScale,
  Legend,
  Tooltip as ChartTooltip,
} from "chart.js";

import "chartjs-adapter-luxon";
import { Chart } from "react-chartjs-2";
import { ChartCrosshairOption } from "@lib/types";
import { numFormat } from "@lib/helpers";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";

interface EmptyProps extends ChartHeaderProps {
  className?: string;
  type: "bar" | "line" | "timeseries";
  placeholder?: string;
}

const Empty: FunctionComponent<EmptyProps> = ({
  className = "h-[400px] w-full",
  type = "bar",
  title,
  placeholder = "Select an option",
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    LineController,
    TimeScale,
    TimeSeriesScale,
    Legend,
    ChartTooltip
  );
  const getType = () => {
    switch (type) {
      case "timeseries":
        return "time";
      case "bar":
        return "category";
      case "line":
        return "linear";
    }
  };

  const options: ChartCrosshairOption<any> = {
    responsive: true,
    maintainAspectRatio: false,
    normalized: true,

    hover: {
      mode: undefined,
    },
    elements: {
      point: {
        borderWidth: 0,
        radius: 0,
        hoverRadius: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "right" as const,
      },
      tooltip: {
        enabled: false,
        bodyFont: {
          family: "Inter",
        },
        mode: "index",
        intersect: false,
      },
      crosshair: false,
    },
    scales: {
      x: {
        type: getType(),
        time: {
          unit: "month",
          round: "month",
          displayFormats: {
            quarter: "MMM",
            month: "MMM",
          },
          tooltipFormat: "dd MMM yyyy",
        },

        grid: {
          display: false,
          borderWidth: 1,
          borderDash: [5, 10],
        },
        ticks: {
          major: {
            enabled: true,
          },
          minRotation: 0,
          maxRotation: 0,
          font: {
            family: "Inter",
          },
        },
      },
      y: {
        grid: {
          display: true,
          borderWidth: 1,
          borderDash: [5, 5],
          drawTicks: false,
          drawBorder: false,
          offset: false,
        },
        ticks: {
          padding: 6,
          callback: (value: string | number) => {
            return numFormat(value as number);
          },
          font: {
            family: "Inter",
          },
        },
      },
    },
  };

  const dummy: ChartData = {
    labels: [
      1579910400000, 1579996800000, 1580083200000, 1580169600000, 1580256000000, 1580342400000,
      1580428800000, 1580515200000, 1580601600000, 1580688000000, 1580774400000, 1580860800000,
      1580947200000, 1581033600000, 1581120000000, 1581206400000, 1581292800000, 1581379200000,
      1581465600000, 1581552000000, 1581638400000, 1581724800000, 1581811200000, 1581897600000,
      1581984000000, 1582070400000, 1582156800000, 1582243200000, 1582329600000, 1582416000000,
      1582502400000, 1582588800000, 1582675200000, 1582761600000, 1582848000000, 1582934400000,
      1583020800000, 1583107200000, 1583193600000, 1583280000000, 1583366400000, 1583452800000,
      1583539200000, 1583625600000, 1583712000000, 1583798400000, 1583884800000, 1583971200000,
      1584057600000, 1584144000000, 1584230400000, 1584316800000, 1584403200000, 1584489600000,
      1584576000000, 1584662400000, 1584748800000, 1584835200000, 1584921600000, 1585008000000,
      1585094400000, 1585180800000, 1585267200000, 1585353600000, 1585440000000, 1585526400000,
      1585612800000, 1585699200000, 1585785600000, 1585872000000, 1585958400000, 1586044800000,
      1586131200000, 1586217600000, 1586304000000, 1586390400000, 1586476800000, 1586563200000,
      1586649600000, 1586736000000, 1586822400000, 1586908800000, 1586995200000, 1587081600000,
      1587168000000, 1587254400000, 1587340800000, 1587427200000, 1587513600000, 1587600000000,
      1587686400000, 1587772800000, 1587859200000, 1587945600000, 1588032000000, 1588118400000,
      1588204800000, 1588291200000, 1588377600000, 1588464000000, 1588550400000, 1588636800000,
      1588723200000, 1588809600000, 1588896000000, 1588982400000, 1589068800000, 1589155200000,
      1589241600000, 1589328000000, 1589414400000, 1589500800000, 1589587200000, 1589673600000,
      1589760000000, 1589846400000, 1589932800000, 1590019200000, 1590105600000, 1590192000000,
      1590278400000, 1590364800000, 1590451200000, 1590537600000, 1590624000000, 1590710400000,
      1590796800000, 1590883200000, 1590969600000, 1591056000000, 1591142400000, 1591228800000,
      1591315200000, 1591401600000, 1591488000000, 1591574400000, 1591660800000, 1591747200000,
      1591833600000,
    ],
    datasets: [
      {
        type: "bar",
        label: "Booster 1",
        data: [
          3, 6, 4, 6, 3, 7, 0, 6, 14, 17, 84, 36, 37, 171, 63, 49, 170, 6, 253, 133, 166, 162, 159,
          62, 230, 205, 212, 209, 191, 200, 106, 176, 250, 158, 113, 138, 101, 97, 152, 185, 156,
          130, 104, 77, 212, 123, 99, 83, 108, 117, 132, 129, 131, 108, 75, 71, 82, 93, 64, 80, 85,
          54, 66, 60, 38, 26, 24, 22, 50, 24, 17, 35, 24, 21, 30, 21, 8, 11, 16, 11, 7, 9, 5, 7, 5,
          5, 15, 9, 2, 2, 8, 1, 3, 11, 6, 0, 3, 2, 0, 5, 9, 1, 9, 4, 7, 4, 4, 3, 8, 5, 2, 2,
        ],
        backgroundColor: "#D9D9D904",
      },
    ],
  };

  return (
    <div className={`relative ${className}`}>
      <ChartHeader title={title} />

      <Chart data={dummy} options={options} type={"bar"} className="pt-4 opacity-50" />
      <div className="absolute left-[30%] top-[40%]">
        <p className="text-dim">{placeholder}</p>
      </div>
    </div>
  );
};

export default Empty;
