var _ = "__lodash_placeholder__";
function t(l, d) {
  for (var e = -1, o = l.length, s = 0, r = []; ++e < o; ) {
    var n = l[e];
    (n === d || n === _) && ((l[e] = _), (r[s++] = e));
  }
  return r;
}
var h = t;
export { h as _ };
