import { i as m } from "./is-callable.js";
import "./object-define-property.js";
import { m as n } from "./make-built-in.js";
import { d as t } from "./define-global-property.js";
import { __exports as b } from "../../../_virtual/object-define-property.js";
var d = m,
  o = b,
  u = n,
  s = t,
  B = function (a, r, l, e) {
    e || (e = {});
    var f = e.enumerable,
      i = e.name !== void 0 ? e.name : r;
    if ((d(l) && u(l, i, e), e.global)) f ? (a[r] = l) : s(r, l);
    else {
      try {
        e.unsafe ? a[r] && (f = !0) : delete a[r];
      } catch {}
      f
        ? (a[r] = l)
        : o.f(a, r, {
            value: l,
            enumerable: !1,
            configurable: !e.nonConfigurable,
            writable: !e.nonWritable,
          });
    }
    return a;
  };
export { B as d };
