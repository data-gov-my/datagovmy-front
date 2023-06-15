import { __exports as v } from "../../../_virtual/es.array.concat.js";
import { _ as I } from "../internals/export.js";
import { f as P } from "../internals/fails.js";
import { __require as R } from "../internals/is-array.js";
import { i as w } from "../internals/is-object.js";
import { t as x } from "../internals/to-object.js";
import { l as N } from "../internals/length-of-array-like.js";
import { __require as j } from "../internals/does-not-exceed-safe-integer.js";
import { c as D } from "../internals/create-property.js";
import { a as L } from "../internals/array-species-create.js";
import { a as V } from "../internals/array-method-has-species-support.js";
import { w as k } from "../internals/well-known-symbol.js";
import { e as T } from "../internals/engine-v8-version.js";
var _;
function Z() {
  if (_) return v;
  _ = 1;
  var l = I,
    y = P,
    S = R(),
    d = w,
    g = x,
    A = N,
    c = j(),
    f = D,
    E = L,
    O = V,
    b = k,
    h = T,
    m = b("isConcatSpreadable"),
    C =
      h >= 51 ||
      !y(function () {
        var r = [];
        return (r[m] = !1), r.concat()[0] !== r;
      }),
    $ = function (r) {
      if (!d(r)) return !1;
      var n = r[m];
      return n !== void 0 ? !!n : S(r);
    },
    q = !C || !O("concat");
  return (
    l(
      { target: "Array", proto: !0, arity: 1, forced: q },
      {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        concat: function (n) {
          var p = g(this),
            i = E(p, 0),
            a = 0,
            t,
            o,
            u,
            s,
            e;
          for (t = -1, u = arguments.length; t < u; t++)
            if (((e = t === -1 ? p : arguments[t]), $(e)))
              for (s = A(e), c(a + s), o = 0; o < s; o++, a++) o in e && f(i, a, e[o]);
            else c(a + 1), f(i, a++, e);
          return (i.length = a), i;
        },
      }
    ),
    v
  );
}
export { Z as __require };
