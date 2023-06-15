import { h as c } from "./has-own-property.js";
import { i as s } from "./is-callable.js";
import { t as O } from "./to-object.js";
import { s as p } from "./shared-key.js";
import { c as n } from "./correct-prototype-getter.js";
var i = c,
  f = s,
  v = O,
  m = p,
  b = n,
  e = m("IE_PROTO"),
  o = Object,
  y = o.prototype,
  E = b
    ? o.getPrototypeOf
    : function (a) {
        var r = v(a);
        if (i(r, e)) return r[e];
        var t = r.constructor;
        return f(t) && r instanceof t ? t.prototype : r instanceof o ? y : null;
      };
export { E as o };
