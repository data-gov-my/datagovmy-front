import { forwardRefWithAs as t, render as a } from "../utils/render.js";
let n = "div";
var s = (e => (
  (e[(e.None = 1)] = "None"),
  (e[(e.Focusable = 2)] = "Focusable"),
  (e[(e.Hidden = 4)] = "Hidden"),
  e
))(s || {});
function l(e, i) {
  let { features: d = 1, ...r } = e,
    o = {
      "ref": i,
      "aria-hidden": (d & 2) === 2 ? !0 : void 0,
      "style": {
        position: "fixed",
        top: 1,
        left: 1,
        width: 1,
        height: 0,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
        ...((d & 4) === 4 && (d & 2) !== 2 && { display: "none" }),
      },
    };
  return a({ ourProps: o, theirProps: r, slot: {}, defaultTag: n, name: "Hidden" });
}
let f = t(l);
export { s as Features, f as Hidden };
