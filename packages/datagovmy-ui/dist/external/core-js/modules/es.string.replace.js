import { __exports as U } from "../../../_virtual/es.string.replace.js";
import { f as ir } from "../internals/function-apply.js";
import { f as nr } from "../internals/function-call.js";
import { f as er } from "../internals/function-uncurry-this.js";
import { __require as tr } from "../internals/fix-regexp-well-known-symbol-logic.js";
import { f as ar } from "../internals/fails.js";
import { a as or } from "../internals/an-object.js";
import { i as fr } from "../internals/is-callable.js";
import { __require as vr } from "../internals/is-null-or-undefined.js";
import { t as ur } from "../internals/to-integer-or-infinity.js";
import { t as mr } from "../internals/to-length.js";
import { t as sr } from "../internals/to-string.js";
import { r as lr } from "../internals/require-object-coercible.js";
import { __require as _r } from "../internals/advance-string-index.js";
import { __require as cr } from "../internals/get-method.js";
import { __require as gr } from "../internals/get-substitution.js";
import { __require as Er } from "../internals/regexp-exec-abstract.js";
import { w as Sr } from "../internals/well-known-symbol.js";
var P;
function Nr() {
  if (P) return U;
  P = 1;
  var T = ir,
    p = nr,
    u = er,
    A = tr(),
    w = ar,
    C = or,
    L = fr,
    N = vr(),
    K = ur,
    M = mr,
    a = sr,
    G = lr,
    D = _r(),
    F = cr(),
    j = gr(),
    k = Er(),
    B = Sr,
    s = B("replace"),
    W = Math.max,
    X = Math.min,
    z = u([].concat),
    l = u([].push),
    x = u("".indexOf),
    b = u("".slice),
    H = function (t) {
      return t === void 0 ? t : String(t);
    },
    J = (function () {
      return "a".replace(/./, "$0") === "$0";
    })(),
    q = (function () {
      return /./[s] ? /./[s]("a", "$0") === "" : !1;
    })(),
    Q = !w(function () {
      var t = /./;
      return (
        (t.exec = function () {
          var o = [];
          return (o.groups = { a: "7" }), o;
        }),
        "".replace(t, "$<a>") !== "7"
      );
    });
  return (
    A(
      "replace",
      function (t, o, Y) {
        var Z = q ? "$" : "$0";
        return [
          // `String.prototype.replace` method
          // https://tc39.es/ecma262/#sec-string.prototype.replace
          function (r, n) {
            var i = G(this),
              f = N(r) ? void 0 : F(r, s);
            return f ? p(f, r, i, n) : p(o, a(i), r, n);
          },
          // `RegExp.prototype[@@replace]` method
          // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
          function ($, r) {
            var n = C(this),
              i = a($);
            if (typeof r == "string" && x(r, Z) === -1 && x(r, "$<") === -1) {
              var f = Y(o, n, i, r);
              if (f.done) return f.value;
            }
            var I = L(r);
            I || (r = a(r));
            var h = n.global;
            if (h) {
              var V = n.unicode;
              n.lastIndex = 0;
            }
            for (var _ = []; ; ) {
              var e = k(n, i);
              if (e === null || (l(_, e), !h)) break;
              var rr = a(e[0]);
              rr === "" && (n.lastIndex = D(i, M(n.lastIndex), V));
            }
            for (var O = "", m = 0, c = 0; c < _.length; c++) {
              e = _[c];
              for (
                var g = a(e[0]), v = W(X(K(e.index), i.length), 0), E = [], S = 1;
                S < e.length;
                S++
              )
                l(E, H(e[S]));
              var d = e.groups;
              if (I) {
                var R = z([g], E, v, i);
                d !== void 0 && l(R, d);
                var y = a(T(r, void 0, R));
              } else y = j(g, i, v, E, d, r);
              v >= m && ((O += b(i, m, v) + y), (m = v + g.length));
            }
            return O + b(i, m);
          },
        ];
      },
      !Q || !J || q
    ),
    U
  );
}
export { Nr as __require };
