function l(n, i, t, d) {
  for (var x = n.length, e = t + (d ? 1 : -1); d ? e-- : ++e < x; ) if (i(n[e], e, n)) return e;
  return -1;
}
var s = l;
export { s as _ };
