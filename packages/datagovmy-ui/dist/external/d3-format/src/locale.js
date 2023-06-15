import D from "./exponent.js";
import H from "./formatGroup.js";
import J from "./formatNumerals.js";
import z from "./formatSpecifier.js";
import K from "./formatTrim.js";
import A from "./formatTypes.js";
import { prefixExponent as O } from "./formatPrefixAuto.js";
import N from "./identity.js";
var C = Array.prototype.map,
  E = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function nn(r) {
  var M =
      r.grouping === void 0 || r.thousands === void 0
        ? N
        : H(C.call(r.grouping, Number), r.thousands + ""),
    G = r.currency === void 0 ? "" : r.currency[0] + "",
    I = r.currency === void 0 ? "" : r.currency[1] + "",
    L = r.decimal === void 0 ? "." : r.decimal + "",
    $ = r.numerals === void 0 ? N : J(C.call(r.numerals, String)),
    j = r.percent === void 0 ? "%" : r.percent + "",
    F = r.minus === void 0 ? "-" : r.minus + "",
    X = r.nan === void 0 ? "NaN" : r.nan + "";
  function w(t) {
    t = z(t);
    var a = t.fill,
      h = t.align,
      m = t.sign,
      g = t.symbol,
      s = t.zero,
      y = t.width,
      b = t.comma,
      d = t.precision,
      k = t.trim,
      i = t.type;
    i === "n" ? ((b = !0), (i = "g")) : A[i] || (d === void 0 && (d = 12), (k = !0), (i = "g")),
      (s || (a === "0" && h === "=")) && ((s = !0), (a = "0"), (h = "="));
    var Z = g === "$" ? G : g === "#" && /[boxX]/.test(i) ? "0" + i.toLowerCase() : "",
      q = g === "$" ? I : /[%p]/.test(i) ? j : "",
      S = A[i],
      B = /[defgprs%]/.test(i);
    d =
      d === void 0
        ? 6
        : /[gprs]/.test(i)
        ? Math.max(1, Math.min(21, d))
        : Math.max(0, Math.min(20, d));
    function P(n) {
      var e = Z,
        f = q,
        p,
        T,
        u;
      if (i === "c") (f = S(n) + f), (n = "");
      else {
        n = +n;
        var x = n < 0 || 1 / n < 0;
        if (
          ((n = isNaN(n) ? X : S(Math.abs(n), d)),
          k && (n = K(n)),
          x && +n == 0 && m !== "+" && (x = !1),
          (e = (x ? (m === "(" ? m : F) : m === "-" || m === "(" ? "" : m) + e),
          (f = (i === "s" ? E[8 + O / 3] : "") + f + (x && m === "(" ? ")" : "")),
          B)
        ) {
          for (p = -1, T = n.length; ++p < T; )
            if (((u = n.charCodeAt(p)), 48 > u || u > 57)) {
              (f = (u === 46 ? L + n.slice(p + 1) : n.slice(p)) + f), (n = n.slice(0, p));
              break;
            }
        }
      }
      b && !s && (n = M(n, 1 / 0));
      var c = e.length + n.length + f.length,
        o = c < y ? new Array(y - c + 1).join(a) : "";
      switch ((b && s && ((n = M(o + n, o.length ? y - f.length : 1 / 0)), (o = "")), h)) {
        case "<":
          n = e + n + f + o;
          break;
        case "=":
          n = e + o + n + f;
          break;
        case "^":
          n = o.slice(0, (c = o.length >> 1)) + e + n + f + o.slice(c);
          break;
        default:
          n = o + e + n + f;
          break;
      }
      return $(n);
    }
    return (
      (P.toString = function () {
        return t + "";
      }),
      P
    );
  }
  function Y(t, a) {
    var h = w(((t = z(t)), (t.type = "f"), t)),
      m = Math.max(-8, Math.min(8, Math.floor(D(a) / 3))) * 3,
      g = Math.pow(10, -m),
      s = E[8 + m / 3];
    return function (y) {
      return h(g * y) + s;
    };
  }
  return {
    format: w,
    formatPrefix: Y,
  };
}
export { nn as default };
