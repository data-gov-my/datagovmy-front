import * as a from "react";
function r(t, n) {
  return (t === n && (t !== 0 || 1 / t === 1 / n)) || (t !== t && n !== n);
}
const i = typeof Object.is == "function" ? Object.is : r,
  { useState: f, useEffect: p, useLayoutEffect: S, useDebugValue: h } = a;
function l(t, n, o) {
  const e = n(),
    [{ inst: s }, u] = f({ inst: { value: e, getSnapshot: n } });
  return (
    S(() => {
      (s.value = e), (s.getSnapshot = n), c(s) && u({ inst: s });
    }, [t, e, n]),
    p(
      () => (
        c(s) && u({ inst: s }),
        t(() => {
          c(s) && u({ inst: s });
        })
      ),
      [t]
    ),
    h(e),
    e
  );
}
function c(t) {
  const n = t.getSnapshot,
    o = t.value;
  try {
    const e = n();
    return !i(o, e);
  } catch {
    return !0;
  }
}
export { l as useSyncExternalStore };
