import { __exports as p } from "../../../_virtual/es.array.slice.js";
import { _ as I } from "../internals/export.js";
import { __require as w } from "../internals/is-array.js";
import { i as E } from "../internals/is-constructor.js";
import { i as P } from "../internals/is-object.js";
import { __require as g } from "../internals/to-absolute-index.js";
import { l as C } from "../internals/length-of-array-like.js";
import { t as j } from "../internals/to-indexed-object.js";
import { c as k } from "../internals/create-property.js";
import { w as H } from "../internals/well-known-symbol.js";
import { a as M } from "../internals/array-method-has-species-support.js";
import { a as K } from "../internals/array-slice.js";
var c;
function W() {
  if (c) return p;
  c = 1;
  var l = I,
    f = w(),
    v = E,
    d = P,
    u = g(),
    y = C,
    _ = j,
    S = k,
    A = H,
    h = M,
    x = K,
    $ = h("slice"),
    b = A("species"),
    i = Array,
    O = Math.max;
  return (
    l(
      { target: "Array", proto: !0, forced: !$ },
      {
        slice: function (q, m) {
          var e = _(this),
            s = y(e),
            a = u(q, s),
            n = u(m === void 0 ? s : m, s),
            r,
            t,
            o;
          if (
            f(e) &&
            ((r = e.constructor),
            v(r) && (r === i || f(r.prototype))
              ? (r = void 0)
              : d(r) && ((r = r[b]), r === null && (r = void 0)),
            r === i || r === void 0)
          )
            return x(e, a, n);
          for (t = new (r === void 0 ? i : r)(O(n - a, 0)), o = 0; a < n; a++, o++)
            a in e && S(t, o, e[a]);
          return (t.length = o), t;
        },
      }
    ),
    p
  );
}
export { W as __require };
