import q from "./none.js";
function A(a, r) {
  if (!(!((h = a.length) > 0) || !((g = (t = a[r[0]]).length) > 0))) {
    for (var n = 0, f = 1, t, g, h; f < g; ++f) {
      for (var v = 0, o = 0, p = 0; v < h; ++v) {
        for (
          var c = a[r[v]], l = c[f][1] || 0, x = c[f - 1][1] || 0, m = (l - x) / 2, u = 0;
          u < v;
          ++u
        ) {
          var w = a[r[u]],
            O = w[f][1] || 0,
            b = w[f - 1][1] || 0;
          m += O - b;
        }
        (o += l), (p += m * l);
      }
      (t[f - 1][1] += t[f - 1][0] = n), o && (n -= p / o);
    }
    (t[f - 1][1] += t[f - 1][0] = n), q(a, r);
  }
}
export { A as default };
