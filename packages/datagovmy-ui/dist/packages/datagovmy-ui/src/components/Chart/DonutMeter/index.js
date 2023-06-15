import { j as e } from "../../../../../../external/react/jsx-runtime.js";
const i = ({ value: r = 30 }) => {
  const t = () => (r >= 90 ? "#DC2626" : r >= 75 ? "#FB8229" : r >= 50 ? "#FBBF24" : "#22C55E");
  return /* @__PURE__ */ e.jsx("figure", {
    "className":
      "donut-meter relative min-h-[56px] min-w-[56px] rounded-[50%] bg-white dark:bg-black",
    "role": "progressbar",
    "aria-valuenow": r,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "style": {
      backgroundImage: `conic-gradient(${t()} 0turn, ${t()} ${(r / 100).toFixed(
        2
      )}turn, rgb(226 232 240) ${(r / 100).toFixed(2)}turn, rgb(226 232 240)  1turn)`,
    },
  });
};
export { i as default };
