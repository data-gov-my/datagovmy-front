import d, { createContext as i, useContext as m } from "react";
import { useIsoMorphicEffect as u } from "../hooks/use-iso-morphic-effect.js";
import { useEvent as f } from "../hooks/use-event.js";
let l = i(() => {});
l.displayName = "StackContext";
var p = (e => ((e[(e.Add = 0)] = "Add"), (e[(e.Remove = 1)] = "Remove"), e))(p || {});
function v() {
  return m(l);
}
function S({ children: e, onUpdate: s, type: a, element: r, enabled: n }) {
  let c = v(),
    o = f((...t) => {
      s == null || s(...t), c(...t);
    });
  return (
    u(() => {
      let t = n === void 0 || n === !0;
      return (
        t && o(0, a, r),
        () => {
          t && o(1, a, r);
        }
      );
    }, [o, a, r, n]),
    d.createElement(l.Provider, { value: o }, e)
  );
}
export { p as StackMessage, S as StackProvider, v as useStackContext };
