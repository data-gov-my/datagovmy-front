import i, { useState as c } from "react";
import { Hidden as m, Features as s } from "./hidden.js";
function F({ onFocus: n }) {
  let [a, r] = c(!0);
  return a
    ? i.createElement(m, {
        as: "button",
        type: "button",
        features: s.Focusable,
        onFocus: o => {
          o.preventDefault();
          let e,
            u = 50;
          function t() {
            if (u-- <= 0) {
              e && cancelAnimationFrame(e);
              return;
            }
            if (n()) {
              r(!1), cancelAnimationFrame(e);
              return;
            }
            e = requestAnimationFrame(t);
          }
          e = requestAnimationFrame(t);
        },
      })
    : null;
}
export { F as FocusSentinel };
