import {
  utcMonday as F,
  utcSunday as Ye,
  utcThursday as S,
} from "../node_modules/d3-time/src/utcWeek.js";
import B from "../node_modules/d3-time/src/utcDay.js";
import { monday as N, sunday as He, thursday as w } from "../node_modules/d3-time/src/week.js";
import G from "../node_modules/d3-time/src/day.js";
import d from "../node_modules/d3-time/src/year.js";
import x from "../node_modules/d3-time/src/utcYear.js";
function H(e) {
  if (0 <= e.y && e.y < 100) {
    var n = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return n.setFullYear(e.y), n;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function b(e) {
  if (0 <= e.y && e.y < 100) {
    var n = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return n.setUTCFullYear(e.y), n;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function M(e, n, t) {
  return { y: e, m: n, d: t, H: 0, M: 0, S: 0, L: 0 };
}
function An(e) {
  var n = e.dateTime,
    t = e.date,
    o = e.time,
    y = e.periods,
    T = e.days,
    k = e.shortDays,
    W = e.months,
    L = e.shortMonths,
    K = v(y),
    ee = D(y),
    ne = v(T),
    te = D(T),
    re = v(k),
    oe = D(k),
    ue = v(W),
    ae = D(W),
    ce = v(L),
    fe = D(L),
    U = {
      "a": Ce,
      "A": pe,
      "b": Me,
      "B": ve,
      "c": null,
      "d": _,
      "e": _,
      "f": en,
      "g": sn,
      "G": gn,
      "H": Ee,
      "I": Je,
      "j": Ke,
      "L": z,
      "m": nn,
      "M": tn,
      "p": De,
      "q": Se,
      "Q": X,
      "s": j,
      "S": rn,
      "u": on,
      "U": un,
      "V": an,
      "w": cn,
      "W": fn,
      "x": null,
      "X": null,
      "y": ln,
      "Y": mn,
      "Z": yn,
      "%": P,
    },
    C = {
      "a": we,
      "A": de,
      "b": xe,
      "B": ke,
      "c": null,
      "d": q,
      "e": q,
      "f": Cn,
      "g": Wn,
      "G": Yn,
      "H": hn,
      "I": Tn,
      "j": Un,
      "L": E,
      "m": pn,
      "M": Mn,
      "p": We,
      "q": Le,
      "Q": X,
      "s": j,
      "S": vn,
      "u": Dn,
      "U": Sn,
      "V": wn,
      "w": dn,
      "W": xn,
      "x": null,
      "X": null,
      "y": kn,
      "Y": Ln,
      "Z": Hn,
      "%": P,
    },
    ie = {
      "a": se,
      "A": me,
      "b": ge,
      "B": ye,
      "c": he,
      "d": Q,
      "e": Q,
      "f": Be,
      "g": R,
      "G": A,
      "H": V,
      "I": V,
      "j": qe,
      "L": je,
      "m": _e,
      "M": Pe,
      "p": le,
      "q": Ve,
      "Q": ze,
      "s": $e,
      "S": Xe,
      "u": Ze,
      "U": Ie,
      "V": Ae,
      "w": Oe,
      "W": Re,
      "x": Te,
      "X": Ue,
      "y": R,
      "Y": A,
      "Z": Qe,
      "%": Ge,
    };
  (U.x = h(t, U)),
    (U.X = h(o, U)),
    (U.c = h(n, U)),
    (C.x = h(t, C)),
    (C.X = h(o, C)),
    (C.c = h(n, C));
  function h(u, a) {
    return function (c) {
      var r = [],
        s = -1,
        i = 0,
        m = u.length,
        g,
        p,
        Z;
      for (c instanceof Date || (c = /* @__PURE__ */ new Date(+c)); ++s < m; )
        u.charCodeAt(s) === 37 &&
          (r.push(u.slice(i, s)),
          (p = I[(g = u.charAt(++s))]) != null ? (g = u.charAt(++s)) : (p = g === "e" ? " " : "0"),
          (Z = a[g]) && (g = Z(c, p)),
          r.push(g),
          (i = s + 1));
      return r.push(u.slice(i, s)), r.join("");
    };
  }
  function O(u, a) {
    return function (c) {
      var r = M(1900, void 0, 1),
        s = Y(r, u, (c += ""), 0),
        i,
        m;
      if (s != c.length) return null;
      if ("Q" in r) return new Date(r.Q);
      if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
      if (
        (a && !("Z" in r) && (r.Z = 0),
        "p" in r && (r.H = (r.H % 12) + r.p * 12),
        r.m === void 0 && (r.m = "q" in r ? r.q : 0),
        "V" in r)
      ) {
        if (r.V < 1 || r.V > 53) return null;
        "w" in r || (r.w = 1),
          "Z" in r
            ? ((i = b(M(r.y, 0, 1))),
              (m = i.getUTCDay()),
              (i = m > 4 || m === 0 ? F.ceil(i) : F(i)),
              (i = B.offset(i, (r.V - 1) * 7)),
              (r.y = i.getUTCFullYear()),
              (r.m = i.getUTCMonth()),
              (r.d = i.getUTCDate() + ((r.w + 6) % 7)))
            : ((i = H(M(r.y, 0, 1))),
              (m = i.getDay()),
              (i = m > 4 || m === 0 ? N.ceil(i) : N(i)),
              (i = G.offset(i, (r.V - 1) * 7)),
              (r.y = i.getFullYear()),
              (r.m = i.getMonth()),
              (r.d = i.getDate() + ((r.w + 6) % 7)));
      } else
        ("W" in r || "U" in r) &&
          ("w" in r || (r.w = "u" in r ? r.u % 7 : "W" in r ? 1 : 0),
          (m = "Z" in r ? b(M(r.y, 0, 1)).getUTCDay() : H(M(r.y, 0, 1)).getDay()),
          (r.m = 0),
          (r.d =
            "W" in r ? ((r.w + 6) % 7) + r.W * 7 - ((m + 5) % 7) : r.w + r.U * 7 - ((m + 6) % 7)));
      return "Z" in r ? ((r.H += (r.Z / 100) | 0), (r.M += r.Z % 100), b(r)) : H(r);
    };
  }
  function Y(u, a, c, r) {
    for (var s = 0, i = a.length, m = c.length, g, p; s < i; ) {
      if (r >= m) return -1;
      if (((g = a.charCodeAt(s++)), g === 37)) {
        if (((g = a.charAt(s++)), (p = ie[g in I ? a.charAt(s++) : g]), !p || (r = p(u, c, r)) < 0))
          return -1;
      } else if (g != c.charCodeAt(r++)) return -1;
    }
    return r;
  }
  function le(u, a, c) {
    var r = K.exec(a.slice(c));
    return r ? ((u.p = ee.get(r[0].toLowerCase())), c + r[0].length) : -1;
  }
  function se(u, a, c) {
    var r = re.exec(a.slice(c));
    return r ? ((u.w = oe.get(r[0].toLowerCase())), c + r[0].length) : -1;
  }
  function me(u, a, c) {
    var r = ne.exec(a.slice(c));
    return r ? ((u.w = te.get(r[0].toLowerCase())), c + r[0].length) : -1;
  }
  function ge(u, a, c) {
    var r = ce.exec(a.slice(c));
    return r ? ((u.m = fe.get(r[0].toLowerCase())), c + r[0].length) : -1;
  }
  function ye(u, a, c) {
    var r = ue.exec(a.slice(c));
    return r ? ((u.m = ae.get(r[0].toLowerCase())), c + r[0].length) : -1;
  }
  function he(u, a, c) {
    return Y(u, n, a, c);
  }
  function Te(u, a, c) {
    return Y(u, t, a, c);
  }
  function Ue(u, a, c) {
    return Y(u, o, a, c);
  }
  function Ce(u) {
    return k[u.getDay()];
  }
  function pe(u) {
    return T[u.getDay()];
  }
  function Me(u) {
    return L[u.getMonth()];
  }
  function ve(u) {
    return W[u.getMonth()];
  }
  function De(u) {
    return y[+(u.getHours() >= 12)];
  }
  function Se(u) {
    return 1 + ~~(u.getMonth() / 3);
  }
  function we(u) {
    return k[u.getUTCDay()];
  }
  function de(u) {
    return T[u.getUTCDay()];
  }
  function xe(u) {
    return L[u.getUTCMonth()];
  }
  function ke(u) {
    return W[u.getUTCMonth()];
  }
  function We(u) {
    return y[+(u.getUTCHours() >= 12)];
  }
  function Le(u) {
    return 1 + ~~(u.getUTCMonth() / 3);
  }
  return {
    format: function (u) {
      var a = h((u += ""), U);
      return (
        (a.toString = function () {
          return u;
        }),
        a
      );
    },
    parse: function (u) {
      var a = O((u += ""), !1);
      return (
        (a.toString = function () {
          return u;
        }),
        a
      );
    },
    utcFormat: function (u) {
      var a = h((u += ""), C);
      return (
        (a.toString = function () {
          return u;
        }),
        a
      );
    },
    utcParse: function (u) {
      var a = O((u += ""), !0);
      return (
        (a.toString = function () {
          return u;
        }),
        a
      );
    },
  };
}
var I = { "-": "", "_": " ", "0": "0" },
  l = /^\s*\d+/,
  be = /^%/,
  Fe = /[\\^$*+?|[\]().{}]/g;
function f(e, n, t) {
  var o = e < 0 ? "-" : "",
    y = (o ? -e : e) + "",
    T = y.length;
  return o + (T < t ? new Array(t - T + 1).join(n) + y : y);
}
function Ne(e) {
  return e.replace(Fe, "\\$&");
}
function v(e) {
  return new RegExp("^(?:" + e.map(Ne).join("|") + ")", "i");
}
function D(e) {
  return new Map(e.map((n, t) => [n.toLowerCase(), t]));
}
function Oe(e, n, t) {
  var o = l.exec(n.slice(t, t + 1));
  return o ? ((e.w = +o[0]), t + o[0].length) : -1;
}
function Ze(e, n, t) {
  var o = l.exec(n.slice(t, t + 1));
  return o ? ((e.u = +o[0]), t + o[0].length) : -1;
}
function Ie(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.U = +o[0]), t + o[0].length) : -1;
}
function Ae(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.V = +o[0]), t + o[0].length) : -1;
}
function Re(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.W = +o[0]), t + o[0].length) : -1;
}
function A(e, n, t) {
  var o = l.exec(n.slice(t, t + 4));
  return o ? ((e.y = +o[0]), t + o[0].length) : -1;
}
function R(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.y = +o[0] + (+o[0] > 68 ? 1900 : 2e3)), t + o[0].length) : -1;
}
function Qe(e, n, t) {
  var o = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(n.slice(t, t + 6));
  return o ? ((e.Z = o[1] ? 0 : -(o[2] + (o[3] || "00"))), t + o[0].length) : -1;
}
function Ve(e, n, t) {
  var o = l.exec(n.slice(t, t + 1));
  return o ? ((e.q = o[0] * 3 - 3), t + o[0].length) : -1;
}
function _e(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.m = o[0] - 1), t + o[0].length) : -1;
}
function Q(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.d = +o[0]), t + o[0].length) : -1;
}
function qe(e, n, t) {
  var o = l.exec(n.slice(t, t + 3));
  return o ? ((e.m = 0), (e.d = +o[0]), t + o[0].length) : -1;
}
function V(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.H = +o[0]), t + o[0].length) : -1;
}
function Pe(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.M = +o[0]), t + o[0].length) : -1;
}
function Xe(e, n, t) {
  var o = l.exec(n.slice(t, t + 2));
  return o ? ((e.S = +o[0]), t + o[0].length) : -1;
}
function je(e, n, t) {
  var o = l.exec(n.slice(t, t + 3));
  return o ? ((e.L = +o[0]), t + o[0].length) : -1;
}
function Be(e, n, t) {
  var o = l.exec(n.slice(t, t + 6));
  return o ? ((e.L = Math.floor(o[0] / 1e3)), t + o[0].length) : -1;
}
function Ge(e, n, t) {
  var o = be.exec(n.slice(t, t + 1));
  return o ? t + o[0].length : -1;
}
function ze(e, n, t) {
  var o = l.exec(n.slice(t));
  return o ? ((e.Q = +o[0]), t + o[0].length) : -1;
}
function $e(e, n, t) {
  var o = l.exec(n.slice(t));
  return o ? ((e.s = +o[0]), t + o[0].length) : -1;
}
function _(e, n) {
  return f(e.getDate(), n, 2);
}
function Ee(e, n) {
  return f(e.getHours(), n, 2);
}
function Je(e, n) {
  return f(e.getHours() % 12 || 12, n, 2);
}
function Ke(e, n) {
  return f(1 + G.count(d(e), e), n, 3);
}
function z(e, n) {
  return f(e.getMilliseconds(), n, 3);
}
function en(e, n) {
  return z(e, n) + "000";
}
function nn(e, n) {
  return f(e.getMonth() + 1, n, 2);
}
function tn(e, n) {
  return f(e.getMinutes(), n, 2);
}
function rn(e, n) {
  return f(e.getSeconds(), n, 2);
}
function on(e) {
  var n = e.getDay();
  return n === 0 ? 7 : n;
}
function un(e, n) {
  return f(He.count(d(e) - 1, e), n, 2);
}
function $(e) {
  var n = e.getDay();
  return n >= 4 || n === 0 ? w(e) : w.ceil(e);
}
function an(e, n) {
  return (e = $(e)), f(w.count(d(e), e) + (d(e).getDay() === 4), n, 2);
}
function cn(e) {
  return e.getDay();
}
function fn(e, n) {
  return f(N.count(d(e) - 1, e), n, 2);
}
function ln(e, n) {
  return f(e.getFullYear() % 100, n, 2);
}
function sn(e, n) {
  return (e = $(e)), f(e.getFullYear() % 100, n, 2);
}
function mn(e, n) {
  return f(e.getFullYear() % 1e4, n, 4);
}
function gn(e, n) {
  var t = e.getDay();
  return (e = t >= 4 || t === 0 ? w(e) : w.ceil(e)), f(e.getFullYear() % 1e4, n, 4);
}
function yn(e) {
  var n = e.getTimezoneOffset();
  return (n > 0 ? "-" : ((n *= -1), "+")) + f((n / 60) | 0, "0", 2) + f(n % 60, "0", 2);
}
function q(e, n) {
  return f(e.getUTCDate(), n, 2);
}
function hn(e, n) {
  return f(e.getUTCHours(), n, 2);
}
function Tn(e, n) {
  return f(e.getUTCHours() % 12 || 12, n, 2);
}
function Un(e, n) {
  return f(1 + B.count(x(e), e), n, 3);
}
function E(e, n) {
  return f(e.getUTCMilliseconds(), n, 3);
}
function Cn(e, n) {
  return E(e, n) + "000";
}
function pn(e, n) {
  return f(e.getUTCMonth() + 1, n, 2);
}
function Mn(e, n) {
  return f(e.getUTCMinutes(), n, 2);
}
function vn(e, n) {
  return f(e.getUTCSeconds(), n, 2);
}
function Dn(e) {
  var n = e.getUTCDay();
  return n === 0 ? 7 : n;
}
function Sn(e, n) {
  return f(Ye.count(x(e) - 1, e), n, 2);
}
function J(e) {
  var n = e.getUTCDay();
  return n >= 4 || n === 0 ? S(e) : S.ceil(e);
}
function wn(e, n) {
  return (e = J(e)), f(S.count(x(e), e) + (x(e).getUTCDay() === 4), n, 2);
}
function dn(e) {
  return e.getUTCDay();
}
function xn(e, n) {
  return f(F.count(x(e) - 1, e), n, 2);
}
function kn(e, n) {
  return f(e.getUTCFullYear() % 100, n, 2);
}
function Wn(e, n) {
  return (e = J(e)), f(e.getUTCFullYear() % 100, n, 2);
}
function Ln(e, n) {
  return f(e.getUTCFullYear() % 1e4, n, 4);
}
function Yn(e, n) {
  var t = e.getUTCDay();
  return (e = t >= 4 || t === 0 ? S(e) : S.ceil(e)), f(e.getUTCFullYear() % 1e4, n, 4);
}
function Hn() {
  return "+0000";
}
function P() {
  return "%";
}
function X(e) {
  return +e;
}
function j(e) {
  return Math.floor(+e / 1e3);
}
export { An as default };
