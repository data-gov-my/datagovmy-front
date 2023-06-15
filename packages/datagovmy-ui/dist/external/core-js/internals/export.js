import { g as n } from "./global.js";
import "./object-get-own-property-descriptor.js";
import { c as y } from "./create-non-enumerable-property.js";
import { d } from "./define-built-in.js";
import { d as v } from "./define-global-property.js";
import { c as u } from "./copy-constructor-properties.js";
import { i as P } from "./is-forced.js";
import { __exports as b } from "../../../_virtual/object-get-own-property-descriptor.js";
var p = n,
  g = b.f,
  G = y,
  C = d,
  _ = v,
  $ = u,
  E = P,
  I = function (r, l) {
    var i = r.target,
      m = r.global,
      s = r.stat,
      c,
      e,
      t,
      o,
      a,
      f;
    if ((m ? (e = p) : s ? (e = p[i] || _(i, {})) : (e = (p[i] || {}).prototype), e))
      for (t in l) {
        if (
          ((a = l[t]),
          r.dontCallGetSet ? ((f = g(e, t)), (o = f && f.value)) : (o = e[t]),
          (c = E(m ? t : i + (s ? "." : "#") + t, r.forced)),
          !c && o !== void 0)
        ) {
          if (typeof a == typeof o) continue;
          $(a, o);
        }
        (r.sham || (o && o.sham)) && G(a, "sham", !0), C(e, t, a, r);
      }
  };
export { I as _ };
