import { f as _ } from "./function-bind-context.js";
import { f as S } from "./function-call.js";
import { t as b } from "./to-object.js";
import { __require as F } from "./call-with-safe-iteration-closing.js";
import { i as L } from "./is-array-iterator-method.js";
import { i as R } from "./is-constructor.js";
import { l as j } from "./length-of-array-like.js";
import { c as k } from "./create-property.js";
import { g as w } from "./get-iterator.js";
import { g as P } from "./get-iterator-method.js";
var u, d;
function K() {
  if (d) return u;
  d = 1;
  var c = _,
    y = S,
    C = b,
    I = F(),
    A = L,
    $ = R,
    O = j,
    v = k,
    q = w,
    x = P,
    l = Array;
  return (
    (u = function (M) {
      var e = C(M),
        g = $(this),
        h = arguments.length,
        a = h > 1 ? arguments[1] : void 0,
        s = a !== void 0;
      s && (a = c(a, h > 2 ? arguments[2] : void 0));
      var f = x(e),
        r = 0,
        o,
        t,
        m,
        i,
        p,
        n;
      if (f && !(this === l && A(f)))
        for (i = q(e, f), p = i.next, t = g ? new this() : []; !(m = y(p, i)).done; r++)
          (n = s ? I(i, a, [m.value, r], !0) : m.value), v(t, r, n);
      else
        for (o = O(e), t = g ? new this(o) : l(o); o > r; r++)
          (n = s ? a(e[r], r) : e[r]), v(t, r, n);
      return (t.length = r), t;
    }),
    u
  );
}
export { K as __require };
