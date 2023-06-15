import { __exports as o } from "../../../_virtual/object-get-own-property-descriptor.js";
import { d as p } from "./descriptors.js";
import { f as a } from "./function-call.js";
import "./object-property-is-enumerable.js";
import { c as i } from "./create-property-descriptor.js";
import { t as s } from "./to-indexed-object.js";
import { t as m } from "./to-property-key.js";
import { h as c } from "./has-own-property.js";
import { i as f } from "./ie8-dom-define.js";
import { __exports as n } from "../../../_virtual/object-property-is-enumerable.js";
var y = p,
  D = a,
  v = n,
  d = i,
  l = s,
  u = m,
  b = c,
  I = f,
  e = Object.getOwnPropertyDescriptor;
o.f = y
  ? e
  : function (r, t) {
      if (((r = l(r)), (t = u(t)), I))
        try {
          return e(r, t);
        } catch {}
      if (b(r, t)) return d(!D(v.f, r, t), r[t]);
    };
export { o as default };
