import { j as e } from "../../../../../../external/react/jsx-runtime.js";
import { ResponsiveWaffle as j } from "../../../../../../external/@nivo/waffle/dist/nivo-waffle.es.js";
import v from "../ChartHeader/index.js";
import { useTheme as b } from "../../../../../../external/next-themes/dist/index.module.js";
const E = ({
    title: t,
    menu: o,
    controls: s,
    className: m,
    data: r = y,
    state: a,
    color: i = "#157857",
    total: f = 100,
    padding: l = 4,
    rows: n = 10,
    cols: p = 10,
    margin: c = { top: 10, right: 0, bottom: 10, left: -20 },
    children: d,
    fillDirection: h = "bottom",
    interactive: u = !1,
  }) => {
    const { theme: x } = b();
    return /* @__PURE__ */ e.jsxs("div", {
      children: [
        /* @__PURE__ */ e.jsx(v, { title: t, menu: o, controls: s, state: a }),
        /* @__PURE__ */ e.jsx("div", {
          className: m,
          children: /* @__PURE__ */ e.jsx(j, {
            data: r,
            total: f,
            rows: n,
            columns: p,
            padding: l,
            emptyColor: x === "light" ? "#f1f5f9" : "#27272a",
            margin: c,
            colors: i,
            animate: !1,
            fillDirection: h,
            isInteractive: u,
          }),
        }),
        d,
      ],
    });
  },
  y = [
    {
      id: "men",
      label: "men",
      value: 9.699015247221036,
    },
  ];
export { E as default };
