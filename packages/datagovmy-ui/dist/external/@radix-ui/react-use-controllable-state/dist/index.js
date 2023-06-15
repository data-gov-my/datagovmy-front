import { useCallback as i, useState as $, useRef as C, useEffect as b } from "react";
import { useCallbackRef as f } from "../../react-use-callback-ref/dist/index.js";
function g({ prop: e, defaultProp: s, onChange: c = () => {} }) {
  const [t, n] = h({
      defaultProp: s,
      onChange: c,
    }),
    o = e !== void 0,
    u = o ? e : t,
    a = f(c),
    d = i(
      r => {
        if (o) {
          const l = typeof r == "function" ? r(e) : r;
          l !== e && a(l);
        } else n(r);
      },
      [o, e, n, a]
    );
  return [u, d];
}
function h({ defaultProp: e, onChange: s }) {
  const c = $(e),
    [t] = c,
    n = C(t),
    o = f(s);
  return (
    b(() => {
      n.current !== t && (o(t), (n.current = t));
    }, [t, n, o]),
    c
  );
}
export { g as useControllableState };
