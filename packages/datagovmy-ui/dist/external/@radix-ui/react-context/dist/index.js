import { createContext as v, useMemo as $, createElement as b, useContext as C } from "react";
function P(e, i = []) {
  let n = [];
  function f(u, t) {
    const o = /* @__PURE__ */ v(t),
      c = n.length;
    n = [...n, t];
    function a(p) {
      const { scope: r, children: x, ...d } = p,
        m = (r == null ? void 0 : r[e][c]) || o,
        S = $(() => d, Object.values(d));
      return /* @__PURE__ */ b(
        m.Provider,
        {
          value: S,
        },
        x
      );
    }
    function l(p, r) {
      const x = (r == null ? void 0 : r[e][c]) || o,
        d = C(x);
      if (d) return d;
      if (t !== void 0) return t;
      throw new Error(`\`${p}\` must be used within \`${u}\``);
    }
    return (a.displayName = u + "Provider"), [a, l];
  }
  const s = () => {
    const u = n.map(t => /* @__PURE__ */ v(t));
    return function (o) {
      const c = (o == null ? void 0 : o[e]) || u;
      return $(
        () => ({
          [`__scope${e}`]: {
            ...o,
            [e]: c,
          },
        }),
        [o, c]
      );
    };
  };
  return (s.scopeName = e), [f, h(s, ...i)];
}
function h(...e) {
  const i = e[0];
  if (e.length === 1) return i;
  const n = () => {
    const f = e.map(s => ({
      useScope: s(),
      scopeName: s.scopeName,
    }));
    return function (u) {
      const t = f.reduce((o, { useScope: c, scopeName: a }) => {
        const p = c(u)[`__scope${a}`];
        return {
          ...o,
          ...p,
        };
      }, {});
      return $(
        () => ({
          [`__scope${i.scopeName}`]: t,
        }),
        [t]
      );
    };
  };
  return (n.scopeName = i.scopeName), n;
}
export { P as createContextScope };
