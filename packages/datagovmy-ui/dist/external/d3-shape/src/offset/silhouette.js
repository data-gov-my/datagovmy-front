import g from "./none.js";
function m(f, a) {
  if ((n = f.length) > 0) {
    for (var t = 0, r = f[a[0]], n, u = r.length; t < u; ++t) {
      for (var o = 0, l = 0; o < n; ++o) l += f[o][t][1] || 0;
      r[t][1] += r[t][0] = -l / 2;
    }
    g(f, a);
  }
}
export { m as default };
