import d from "../../../@babel/runtime/helpers/esm/extends.js";
import {
  forwardRef as m,
  Children as s,
  isValidElement as f,
  createElement as a,
  cloneElement as $,
  Fragment as y,
} from "react";
import { composeRefs as h } from "../../react-compose-refs/dist/index.js";
const b = /* @__PURE__ */ m((r, t) => {
  const { children: e, ...n } = r,
    o = s.toArray(e),
    l = o.find(x);
  if (l) {
    const c = l.props.children,
      i = o.map(u =>
        u === l
          ? s.count(c) > 1
            ? s.only(null)
            : /* @__PURE__ */ f(c)
            ? c.props.children
            : null
          : u
      );
    return /* @__PURE__ */ a(
      p,
      d({}, n, {
        ref: t,
      }),
      /* @__PURE__ */ f(c) ? /* @__PURE__ */ $(c, void 0, i) : null
    );
  }
  return /* @__PURE__ */ a(
    p,
    d({}, n, {
      ref: t,
    }),
    e
  );
});
b.displayName = "Slot";
const p = /* @__PURE__ */ m((r, t) => {
  const { children: e, ...n } = r;
  return /* @__PURE__ */ f(e)
    ? /* @__PURE__ */ $(e, {
        ...v(n, e.props),
        ref: t ? h(t, e.ref) : e.ref,
      })
    : s.count(e) > 1
    ? s.only(null)
    : null;
});
p.displayName = "SlotClone";
const S = ({ children: r }) => /* @__PURE__ */ a(y, null, r);
function x(r) {
  return /* @__PURE__ */ f(r) && r.type === S;
}
function v(r, t) {
  const e = {
    ...t,
  };
  for (const n in t) {
    const o = r[n],
      l = t[n];
    /^on[A-Z]/.test(n)
      ? o && l
        ? (e[n] = (...i) => {
            l(...i), o(...i);
          })
        : o && (e[n] = o)
      : n === "style"
      ? (e[n] = {
          ...o,
          ...l,
        })
      : n === "className" && (e[n] = [o, l].filter(Boolean).join(" "));
  }
  return {
    ...r,
    ...e,
  };
}
export { b as Slot, S as Slottable };
