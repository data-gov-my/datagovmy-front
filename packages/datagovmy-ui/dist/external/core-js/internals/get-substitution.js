import { f as M } from "./function-uncurry-this.js";
import { t as N } from "./to-object.js";
var s, O;
function A() {
  if (O) return s;
  O = 1;
  var a = M,
    $ = N,
    d = Math.floor,
    o = a("".charAt),
    g = a("".replace),
    f = a("".slice),
    _ = /\$([$&'`]|\d{1,2}|<[^>]*>)/g,
    U = /\$([$&'`]|\d{1,2})/g;
  return (
    (s = function (S, c, l, e, t, B) {
      var I = l + S.length,
        T = e.length,
        b = U;
      return (
        t !== void 0 && ((t = $(t)), (b = _)),
        g(B, b, function (v, r) {
          var i;
          switch (o(r, 0)) {
            case "$":
              return "$";
            case "&":
              return S;
            case "`":
              return f(c, 0, l);
            case "'":
              return f(c, I);
            case "<":
              i = t[f(r, 1, -1)];
              break;
            default:
              var n = +r;
              if (n === 0) return v;
              if (n > T) {
                var u = d(n / 10);
                return u === 0
                  ? v
                  : u <= T
                  ? e[u - 1] === void 0
                    ? o(r, 1)
                    : e[u - 1] + o(r, 1)
                  : v;
              }
              i = e[n - 1];
          }
          return i === void 0 ? "" : i;
        })
      );
    }),
    s
  );
}
export { A as __require };
