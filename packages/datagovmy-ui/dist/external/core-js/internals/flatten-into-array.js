import { __require as c } from "./is-array.js";
import { l as g } from "./length-of-array-like.js";
import { __require as h } from "./does-not-exceed-safe-integer.js";
import { f as p } from "./function-bind-context.js";
var n, m;
function N() {
  if (m) return n;
  m = 1;
  var I = c(),
    y = g,
    A = h(),
    d = p,
    i = function (o, f, a, q, _, u, l, x) {
      for (var r = _, e = 0, s = l ? d(l, x) : !1, t, v; e < q; )
        e in a &&
          ((t = s ? s(a[e], e, f) : a[e]),
          u > 0 && I(t) ? ((v = y(t)), (r = i(o, f, t, v, r, u - 1) - 1)) : (A(r + 1), (o[r] = t)),
          r++),
          e++;
      return r;
    };
  return (n = i), n;
}
export { N as __require };
