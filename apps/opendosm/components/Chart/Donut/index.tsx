export default {};
// import { FunctionComponent } from "react";
// import { ResponsiveRadialBar } from "@nivo/radial-bar";
// import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
// import type { OrdinalColorScaleConfigScheme } from "@nivo/colors";

// interface DonutProps extends ChartHeaderProps {
//   className?: string;
//   data?: any;
//   animate?: boolean;
//   innerRadius?: number;
//   interactive?: boolean;
//   type?: "progress" | "default";
// }

// const Donut: FunctionComponent<DonutProps> = ({
//   className = "",
//   data = dummy,
//   menu,
//   title,
//   controls,
//   state,
//   animate = false,
//   interactive = true,
//   innerRadius = 0.7,
//   type = "default",
// }) => {
//   const colors = (data: Array<any>, key = "y") => {
//     switch (type) {
//       case "progress":
//         if (percentage(data, key) > 90) return ["#DC2626", "rgb(241, 245, 249)"];
//         if (percentage(data, key) > 75) return ["#FB8229", "rgb(241, 245, 249)"];
//         if (percentage(data, key) > 50) return ["#FBBF24", "rgb(241, 245, 249)"];
//         else return ["#22C55E", "rgb(241, 245, 249)"];
//       default:
//         return { scheme: "category10" as OrdinalColorScaleConfigScheme["scheme"] };
//     }
//   };

//   const percentage = (data: Array<any>, key: string) => {
//     const actual = data[0][key];
//     const total = data.reduce((prev, current) => prev + current[key], 0);

//     return Math.floor((actual / total) * 100);
//   };

//   return (
//     <div>
//       <ChartHeader title={title} menu={menu} controls={controls} state={state} />
//       <div className={className}>
//         <ResponsiveRadialBar
//           data={data}
//           theme={{
//             grid: {
//               line: {
//                 strokeWidth: 1.5,
//                 strokeDasharray: "5 5",
//               },
//             },
//           }}
//           colors={colors(data[0].data, "y")}
//           endAngle={360}
//           radialAxisStart={null}
//           radialAxisEnd={null}
//           circularAxisOuter={null}
//           enableRadialGrid={false}
//           innerRadius={innerRadius}
//           animate={animate}
//           isInteractive={interactive}
//           padding={0.1}
//         />
//       </div>
//     </div>
//   );
// };

// const dummy = [
//   {
//     id: "Supermarket",
//     data: [
//       {
//         x: "Vegetables",
//         y: 238,
//       },
//       {
//         x: "Fruits",
//         y: 78,
//       },
//     ],
//   },
// ];

// export default Donut;
