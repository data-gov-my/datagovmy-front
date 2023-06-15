var h = Math.ceil,
  t = Math.max;
function x(a, r, n, l) {
  for (var v = -1, e = t(h((r - a) / (n || 1)), 0), i = Array(e); e--; )
    (i[l ? e : ++v] = a), (a += n);
  return i;
}
var g = x;
export { g as _ };
