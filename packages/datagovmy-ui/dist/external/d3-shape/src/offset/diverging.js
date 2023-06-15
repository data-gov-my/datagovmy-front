function n(e, u) {
  if ((g = e.length) > 0)
    for (var l, a = 0, f, t, o, r, g, h = e[u[0]].length; a < h; ++a)
      for (o = r = 0, l = 0; l < g; ++l)
        (t = (f = e[u[l]][a])[1] - f[0]) > 0
          ? ((f[0] = o), (f[1] = o += t))
          : t < 0
          ? ((f[1] = r), (f[0] = r += t))
          : ((f[0] = 0), (f[1] = t));
}
export { n as default };
