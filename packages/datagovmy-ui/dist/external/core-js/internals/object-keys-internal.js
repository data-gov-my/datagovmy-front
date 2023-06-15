import { f } from "./function-uncurry-this.js";
import { h } from "./has-own-property.js";
import { t as d } from "./to-indexed-object.js";
import { a as v } from "./array-includes.js";
import { h as u } from "./hidden-keys.js";
var m = f,
  n = h,
  p = d,
  c = v.indexOf,
  y = u,
  i = m([].push),
  j = function (s, o) {
    var e = p(s),
      t = 0,
      a = [],
      r;
    for (r in e) !n(y, r) && n(e, r) && i(a, r);
    for (; o.length > t; ) n(e, (r = o[t++])) && (~c(a, r) || i(a, r));
    return a;
  };
export { j as o };
