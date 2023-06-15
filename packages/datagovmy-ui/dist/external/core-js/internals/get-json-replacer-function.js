import { f as m } from "./function-uncurry-this.js";
import { __require as p } from "./is-array.js";
import { i as c } from "./is-callable.js";
import { c as e } from "./classof-raw.js";
import { t as b } from "./to-string.js";
var S = m,
  n = p(),
  k = c,
  u = e,
  l = b,
  v = S([].push),
  R = function (t) {
    if (k(t)) return t;
    if (n(t)) {
      for (var g = t.length, i = [], a = 0; a < g; a++) {
        var r = t[a];
        typeof r == "string"
          ? v(i, r)
          : (typeof r == "number" || u(r) == "Number" || u(r) == "String") && v(i, l(r));
      }
      var h = i.length,
        f = !0;
      return function (y, o) {
        if (f) return (f = !1), o;
        if (n(this)) return o;
        for (var s = 0; s < h; s++) if (i[s] === y) return o;
      };
    }
  };
export { R as g };
