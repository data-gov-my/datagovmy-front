import f, { createContext as m, useContext as d, useState as h, useMemo as p } from "react";
import { useId as g } from "../../hooks/use-id.js";
import { forwardRefWithAs as E, render as v } from "../../utils/render.js";
import { useIsoMorphicEffect as D } from "../../hooks/use-iso-morphic-effect.js";
import { useSyncRefs as S } from "../../hooks/use-sync-refs.js";
import { useEvent as x } from "../../hooks/use-event.js";
let u = m(null);
function c() {
  let o = d(u);
  if (o === null) {
    let r = new Error(
      "You used a <Description /> component, but it is not inside a relevant parent."
    );
    throw (Error.captureStackTrace && Error.captureStackTrace(r, c), r);
  }
  return o;
}
function k() {
  let [o, r] = h([]);
  return [
    o.length > 0 ? o.join(" ") : void 0,
    p(
      () =>
        function (e) {
          let s = x(
              t => (
                r(n => [...n, t]),
                () =>
                  r(n => {
                    let i = n.slice(),
                      l = i.indexOf(t);
                    return l !== -1 && i.splice(l, 1), i;
                  })
              )
            ),
            a = p(
              () => ({ register: s, slot: e.slot, name: e.name, props: e.props }),
              [s, e.slot, e.name, e.props]
            );
          return f.createElement(u.Provider, { value: a }, e.children);
        },
      [r]
    ),
  ];
}
let b = "p";
function w(o, r) {
  let e = g(),
    { id: s = `headlessui-description-${e}`, ...a } = o,
    t = c(),
    n = S(r);
  D(() => t.register(s), [s, t.register]);
  let i = { ref: n, ...t.props, id: s };
  return v({
    ourProps: i,
    theirProps: a,
    slot: t.slot || {},
    defaultTag: b,
    name: t.name || "Description",
  });
}
let y = E(w),
  C = Object.assign(y, {});
export { C as Description, k as useDescriptions };
