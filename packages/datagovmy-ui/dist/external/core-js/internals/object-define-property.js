import { __exports as c } from "../../../_virtual/object-define-property.js";
import { d as E } from "./descriptors.js";
import { i as l } from "./ie8-dom-define.js";
import { v as D } from "./v8-prototype-define-bug.js";
import { a as d } from "./an-object.js";
import { t as _ } from "./to-property-key.js";
var g = E,
  I = l,
  R = D,
  n = d,
  y = _,
  T = TypeError,
  p = Object.defineProperty,
  j = Object.getOwnPropertyDescriptor,
  f = "enumerable",
  i = "configurable",
  v = "writable";
c.f = g
  ? R
    ? function (o, e, r) {
        if (
          (n(o),
          (e = y(e)),
          n(r),
          typeof o == "function" && e === "prototype" && "value" in r && v in r && !r[v])
        ) {
          var a = j(o, e);
          a &&
            a[v] &&
            ((o[e] = r.value),
            (r = {
              configurable: i in r ? r[i] : a[i],
              enumerable: f in r ? r[f] : a[f],
              writable: !1,
            }));
        }
        return p(o, e, r);
      }
    : p
  : function (o, e, r) {
      if ((n(o), (e = y(e)), n(r), I))
        try {
          return p(o, e, r);
        } catch {}
      if ("get" in r || "set" in r) throw T("Accessors not supported");
      return "value" in r && (o[e] = r.value), o;
    };
export { c as default };
