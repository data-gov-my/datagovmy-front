function g(n, o) {
  if ((r = n.length) > 1)
    for (var l = 1, t, a, f = n[o[0]], r, u = f.length; l < r; ++l)
      for (a = f, f = n[o[l]], t = 0; t < u; ++t)
        f[t][1] += f[t][0] = isNaN(a[t][1]) ? a[t][0] : a[t][1];
}
export { g as default };
