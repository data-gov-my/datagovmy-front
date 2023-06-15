var c = Math.max;
function f(t, n, g, d) {
  for (
    var e = -1,
      i = t.length,
      a = -1,
      o = g.length,
      h = -1,
      s = n.length,
      l = c(i - o, 0),
      r = Array(l + s),
      v = !d;
    ++e < l;

  )
    r[e] = t[e];
  for (var x = e; ++h < s; ) r[x + h] = n[h];
  for (; ++a < o; ) (v || e < i) && (r[x + g[a]] = t[e++]);
  return r;
}
var u = f;
export { u as _ };
