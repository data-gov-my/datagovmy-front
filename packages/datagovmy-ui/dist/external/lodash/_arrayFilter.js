function s(e, l) {
  for (var n = -1, i = e == null ? 0 : e.length, h = 0, r = []; ++n < i; ) {
    var t = e[n];
    l(t, n, e) && (r[h++] = t);
  }
  return r;
}
var u = s;
export { u as _ };
