import { __module as d } from "../../../_virtual/mergeDiff.js";
(function (p, i) {
  (i.__esModule = !0), (i.default = O);
  function O(u, l, g) {
    for (var e = {}, r = 0; r < u.length; r++) e[u[r].key] = r;
    for (var n = {}, r = 0; r < l.length; r++) n[l[r].key] = r;
    for (var s = [], r = 0; r < l.length; r++) s[r] = l[r];
    for (var r = 0; r < u.length; r++)
      if (!Object.prototype.hasOwnProperty.call(n, u[r].key)) {
        var h = g(r, u[r]);
        h != null && s.push(h);
      }
    return s.sort(function (o, a) {
      var y = n[o.key],
        k = n[a.key],
        v = e[o.key],
        c = e[a.key];
      if (y != null && k != null) return n[o.key] - n[a.key];
      if (v != null && c != null) return e[o.key] - e[a.key];
      if (y != null) {
        for (var f = 0; f < l.length; f++) {
          var t = l[f].key;
          if (Object.prototype.hasOwnProperty.call(e, t)) {
            if (y < n[t] && c > e[t]) return -1;
            if (y > n[t] && c < e[t]) return 1;
          }
        }
        return 1;
      }
      for (var f = 0; f < l.length; f++) {
        var t = l[f].key;
        if (Object.prototype.hasOwnProperty.call(e, t)) {
          if (k < n[t] && v > e[t]) return 1;
          if (k > n[t] && v < e[t]) return -1;
        }
      }
      return -1;
    });
  }
  p.exports = i.default;
})(d, d.exports);
var _ = d.exports;
export { _ as m };
