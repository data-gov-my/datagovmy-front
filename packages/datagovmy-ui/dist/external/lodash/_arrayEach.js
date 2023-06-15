function t(e, l) {
  for (var n = -1, h = e == null ? 0 : e.length; ++n < h && l(e[n], n, e) !== !1; );
  return e;
}
var i = t;
export { i as _ };
