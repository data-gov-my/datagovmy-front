function h(t, n) {
  var e = -1,
    r = t.length;
  for (n || (n = Array(r)); ++e < r; ) n[e] = t[e];
  return n;
}
var i = h;
export { i as _ };
