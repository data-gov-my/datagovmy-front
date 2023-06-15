var c = Math.max;
function f(r, h, g, s) {
  for (
    var e = -1,
      a = r.length,
      l = g.length,
      n = -1,
      i = h.length,
      o = c(a - l, 0),
      t = Array(i + o),
      x = !s;
    ++n < i;

  )
    t[n] = h[n];
  for (; ++e < l; ) (x || e < a) && (t[g[e]] = r[e]);
  for (; o--; ) t[n++] = r[e++];
  return t;
}
var u = f;
export { u as _ };
