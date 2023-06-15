import {
  forwardRef as b,
  Fragment as h,
  isValidElement as w,
  cloneElement as O,
  createElement as E,
} from "react";
import { classNames as v } from "./class-names.js";
import { match as R } from "./match.js";
var S = (e => (
    (e[(e.None = 0)] = "None"),
    (e[(e.RenderStrategy = 1)] = "RenderStrategy"),
    (e[(e.Static = 2)] = "Static"),
    e
  ))(S || {}),
  F = (e => ((e[(e.Unmount = 0)] = "Unmount"), (e[(e.Hidden = 1)] = "Hidden"), e))(F || {});
function H({
  ourProps: e,
  theirProps: t,
  slot: n,
  defaultTag: a,
  features: r,
  visible: u = !0,
  name: i,
}) {
  let o = j(t, e);
  if (u) return p(o, n, a, i);
  let d = r ?? 0;
  if (d & 2) {
    let { static: s = !1, ...c } = o;
    if (s) return p(c, n, a, i);
  }
  if (d & 1) {
    let { unmount: s = !0, ...c } = o;
    return R(s ? 0 : 1, {
      [0]() {
        return null;
      },
      [1]() {
        return p({ ...c, hidden: !0, style: { display: "none" } }, n, a, i);
      },
    });
  }
  return p(o, n, a, i);
}
function p(e, t = {}, n, a) {
  let { as: r = n, children: u, refName: i = "ref", ...o } = y(e, ["unmount", "static"]),
    d = e.ref !== void 0 ? { [i]: e.ref } : {},
    s = typeof u == "function" ? u(t) : u;
  "className" in o &&
    o.className &&
    typeof o.className == "function" &&
    (o.className = o.className(t));
  let c = {};
  if (t) {
    let l = !1,
      m = [];
    for (let [g, f] of Object.entries(t)) typeof f == "boolean" && (l = !0), f === !0 && m.push(g);
    l && (c["data-headlessui-state"] = m.join(" "));
  }
  if (r === h && Object.keys(N(o)).length > 0) {
    if (!w(s) || (Array.isArray(s) && s.length > 1))
      throw new Error(
        [
          'Passing props on "Fragment"!',
          "",
          `The current component <${a} /> is rendering a "Fragment".`,
          "However we need to passthrough the following props:",
          Object.keys(o).map(f => `  - ${f}`).join(`
`),
          "",
          "You can apply a few solutions:",
          [
            'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
            "Render a single element as the child so that we can forward the props onto that element.",
          ].map(f => `  - ${f}`).join(`
`),
        ].join(`
`)
      );
    let l = s.props,
      m =
        typeof (l == null ? void 0 : l.className) == "function"
          ? (...f) => v(l == null ? void 0 : l.className(...f), o.className)
          : v(l == null ? void 0 : l.className, o.className),
      g = m ? { className: m } : {};
    return O(s, Object.assign({}, j(s.props, N(y(o, ["ref"]))), c, d, A(s.ref, d.ref), g));
  }
  return E(r, Object.assign({}, y(o, ["ref"]), r !== h && d, r !== h && c), s);
}
function A(...e) {
  return {
    ref: e.every(t => t == null)
      ? void 0
      : t => {
          for (let n of e) n != null && (typeof n == "function" ? n(t) : (n.current = t));
        },
  };
}
function j(...e) {
  if (e.length === 0) return {};
  if (e.length === 1) return e[0];
  let t = {},
    n = {};
  for (let a of e)
    for (let r in a)
      r.startsWith("on") && typeof a[r] == "function"
        ? (n[r] != null || (n[r] = []), n[r].push(a[r]))
        : (t[r] = a[r]);
  if (t.disabled || t["aria-disabled"])
    return Object.assign(t, Object.fromEntries(Object.keys(n).map(a => [a, void 0])));
  for (let a in n)
    Object.assign(t, {
      [a](r, ...u) {
        let i = n[a];
        for (let o of i) {
          if (
            (r instanceof Event || (r == null ? void 0 : r.nativeEvent) instanceof Event) &&
            r.defaultPrevented
          )
            return;
          o(r, ...u);
        }
      },
    });
  return t;
}
function T(e) {
  var t;
  return Object.assign(b(e), { displayName: (t = e.displayName) != null ? t : e.name });
}
function N(e) {
  let t = Object.assign({}, e);
  for (let n in t) t[n] === void 0 && delete t[n];
  return t;
}
function y(e, t = []) {
  let n = Object.assign({}, e);
  for (let a of t) a in n && delete n[a];
  return n;
}
export { S as Features, F as RenderStrategy, N as compact, T as forwardRefWithAs, H as render };
