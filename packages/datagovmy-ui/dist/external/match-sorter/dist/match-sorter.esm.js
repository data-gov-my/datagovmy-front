import _ from "../../@babel/runtime/helpers/esm/extends.js";
import m from "../../remove-accents/index.js";
var c = {
  CASE_SENSITIVE_EQUAL: 7,
  EQUAL: 6,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
  CONTAINS: 3,
  ACRONYM: 2,
  MATCHES: 1,
  NO_MATCH: 0,
};
E.rankings = c;
var x = function (r, n) {
  return String(r.rankedValue).localeCompare(String(n.rankedValue));
};
function E(e, r, n) {
  n === void 0 && (n = {});
  var a = n,
    i = a.keys,
    o = a.threshold,
    t = o === void 0 ? c.MATCHES : o,
    u = a.baseSort,
    f = u === void 0 ? x : u,
    h = a.sorter,
    k =
      h === void 0
        ? function (v) {
            return v.sort(function (d, l) {
              return b(d, l, f);
            });
          }
        : h,
    A = e.reduce(s, []);
  return k(A).map(function (v) {
    var d = v.item;
    return d;
  });
  function s(v, d, l) {
    var y = H(d, i, r, n),
      I = y.rank,
      p = y.keyThreshold,
      C = p === void 0 ? t : p;
    return (
      I >= C &&
        v.push(
          _({}, y, {
            item: d,
            index: l,
          })
        ),
      v
    );
  }
}
function H(e, r, n, a) {
  if (!r) {
    var i = e;
    return {
      // ends up being duplicate of 'item' in matches but consistent
      rankedValue: i,
      rank: T(i, n, a),
      keyIndex: -1,
      keyThreshold: a.threshold,
    };
  }
  var o = R(e, r);
  return o.reduce(
    function (t, u, f) {
      var h = t.rank,
        k = t.rankedValue,
        A = t.keyIndex,
        s = t.keyThreshold,
        v = u.itemValue,
        d = u.attributes,
        l = T(v, n, a),
        y = k,
        I = d.minRanking,
        p = d.maxRanking,
        C = d.threshold;
      return (
        l < I && l >= c.MATCHES ? (l = I) : l > p && (l = p),
        l > h && ((h = l), (A = f), (s = C), (y = v)),
        {
          rankedValue: y,
          rank: h,
          keyIndex: A,
          keyThreshold: s,
        }
      );
    },
    {
      rankedValue: e,
      rank: c.NO_MATCH,
      keyIndex: -1,
      keyThreshold: a.threshold,
    }
  );
}
function T(e, r, n) {
  return (
    (e = O(e, n)),
    (r = O(r, n)),
    r.length > e.length
      ? c.NO_MATCH
      : e === r
      ? c.CASE_SENSITIVE_EQUAL
      : ((e = e.toLowerCase()),
        (r = r.toLowerCase()),
        e === r
          ? c.EQUAL
          : e.startsWith(r)
          ? c.STARTS_WITH
          : e.includes(" " + r)
          ? c.WORD_STARTS_WITH
          : e.includes(r)
          ? c.CONTAINS
          : r.length === 1
          ? c.NO_MATCH
          : N(e).includes(r)
          ? c.ACRONYM
          : g(e, r))
  );
}
function N(e) {
  var r = "",
    n = e.split(" ");
  return (
    n.forEach(function (a) {
      var i = a.split("-");
      i.forEach(function (o) {
        r += o.substr(0, 1);
      });
    }),
    r
  );
}
function g(e, r) {
  var n = 0,
    a = 0;
  function i(s, v, d) {
    for (var l = d, y = v.length; l < y; l++) {
      var I = v[l];
      if (I === s) return (n += 1), l + 1;
    }
    return -1;
  }
  function o(s) {
    var v = 1 / s,
      d = n / r.length,
      l = c.MATCHES + d * v;
    return l;
  }
  var t = i(r[0], e, 0);
  if (t < 0) return c.NO_MATCH;
  a = t;
  for (var u = 1, f = r.length; u < f; u++) {
    var h = r[u];
    a = i(h, e, a);
    var k = a > -1;
    if (!k) return c.NO_MATCH;
  }
  var A = a - t;
  return o(A);
}
function b(e, r, n) {
  var a = -1,
    i = 1,
    o = e.rank,
    t = e.keyIndex,
    u = r.rank,
    f = r.keyIndex,
    h = o === u;
  return h ? (t === f ? n(e, r) : t < f ? a : i) : o > u ? a : i;
}
function O(e, r) {
  var n = r.keepDiacritics;
  return (e = "" + e), n || (e = m(e)), e;
}
function M(e, r) {
  typeof r == "object" && (r = r.key);
  var n;
  if (typeof r == "function") n = r(e);
  else if (e == null) n = null;
  else if (Object.hasOwnProperty.call(e, r)) n = e[r];
  else {
    if (r.includes(".")) return V(r, e);
    n = null;
  }
  return n == null ? [] : Array.isArray(n) ? n : [String(n)];
}
function V(e, r) {
  for (var n = e.split("."), a = [r], i = 0, o = n.length; i < o; i++) {
    for (var t = n[i], u = [], f = 0, h = a.length; f < h; f++) {
      var k = a[f];
      if (k != null)
        if (Object.hasOwnProperty.call(k, t)) {
          var A = k[t];
          A != null && u.push(A);
        } else t === "*" && (u = u.concat(k));
    }
    a = u;
  }
  if (Array.isArray(a[0])) {
    var s = [];
    return s.concat.apply(s, a);
  }
  return a;
}
function R(e, r) {
  for (var n = [], a = 0, i = r.length; a < i; a++)
    for (var o = r[a], t = W(o), u = M(e, o), f = 0, h = u.length; f < h; f++)
      n.push({
        itemValue: u[f],
        attributes: t,
      });
  return n;
}
var S = {
  maxRanking: 1 / 0,
  minRanking: -1 / 0,
};
function W(e) {
  return typeof e == "string" ? S : _({}, S, e);
}
export { x as defaultBaseSortFn, E as matchSorter, c as rankings };
