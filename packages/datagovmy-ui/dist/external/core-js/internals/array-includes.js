import { t as d } from "./to-indexed-object.js";
import { __require as l } from "./to-absolute-index.js";
import { l as s } from "./length-of-array-like.js";
var v = d,
  c = l(),
  x = s,
  o = function (e) {
    return function (u, a, f) {
      var t = v(u),
        n = x(t),
        r = c(f, n),
        i;
      if (e && a != a) {
        for (; n > r; ) if (((i = t[r++]), i != i)) return !0;
      } else for (; n > r; r++) if ((e || r in t) && t[r] === a) return e || r || 0;
      return !e && -1;
    };
  },
  b = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: o(!0),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: o(!1),
  };
export { b as a };
