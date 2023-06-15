import { f as $ } from "./function-call.js";
import { f as B } from "./function-uncurry-this.js";
import { t as K } from "./to-string.js";
import { __require as W } from "./regexp-flags.js";
import { __require as X } from "./regexp-sticky-helpers.js";
import { s as Y } from "./shared.js";
import { o as z } from "./object-create.js";
import { i as J } from "./internal-state.js";
import { __require as M } from "./regexp-unsupported-dot-all.js";
import { __require as Q } from "./regexp-unsupported-ncg.js";
var h, T;
function oe() {
  if (T) return h;
  T = 1;
  var t = $,
    n = B,
    A = K,
    C = W(),
    D = X(),
    P = Y,
    O = z,
    b = J.get,
    k = M(),
    w = Q(),
    L = P("native-string-replace", String.prototype.replace),
    s = RegExp.prototype.exec,
    c = s,
    G = n("".charAt),
    H = n("".indexOf),
    j = n("".replace),
    v = n("".slice),
    g = (function () {
      var m = /a/,
        l = /b*/g;
      return t(s, m, "a"), t(s, l, "a"), m.lastIndex !== 0 || l.lastIndex !== 0;
    })(),
    S = D.BROKEN_CARET,
    d = /()??/.exec("")[1] !== void 0,
    F = g || d || S || k || w;
  return (
    F &&
      (c = function (l) {
        var r = this,
          q = b(r),
          o = A(l),
          p = q.raw,
          y,
          u,
          U,
          e,
          a,
          N,
          _;
        if (p) return (p.lastIndex = r.lastIndex), (y = t(c, p, o)), (r.lastIndex = p.lastIndex), y;
        var I = q.groups,
          E = S && r.sticky,
          i = t(C, r),
          f = r.source,
          R = 0,
          x = o;
        if (
          (E &&
            ((i = j(i, "y", "")),
            H(i, "g") === -1 && (i += "g"),
            (x = v(o, r.lastIndex)),
            r.lastIndex > 0 &&
              (!r.multiline ||
                (r.multiline &&
                  G(o, r.lastIndex - 1) !==
                    `
`)) &&
              ((f = "(?: " + f + ")"), (x = " " + x), R++),
            (u = new RegExp("^(?:" + f + ")", i))),
          d && (u = new RegExp("^" + f + "$(?!\\s)", i)),
          g && (U = r.lastIndex),
          (e = t(s, E ? u : r, x)),
          E
            ? e
              ? ((e.input = v(e.input, R)),
                (e[0] = v(e[0], R)),
                (e.index = r.lastIndex),
                (r.lastIndex += e[0].length))
              : (r.lastIndex = 0)
            : g && e && (r.lastIndex = r.global ? e.index + e[0].length : U),
          d &&
            e &&
            e.length > 1 &&
            t(L, e[0], u, function () {
              for (a = 1; a < arguments.length - 2; a++) arguments[a] === void 0 && (e[a] = void 0);
            }),
          e && I)
        )
          for (e.groups = N = O(null), a = 0; a < I.length; a++) (_ = I[a]), (N[_[0]] = e[_[1]]);
        return e;
      }),
    (h = c),
    h
  );
}
export { oe as __require };
