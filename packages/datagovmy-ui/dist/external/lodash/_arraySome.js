function r(e, t) {
  for (var n = -1, l = e == null ? 0 : e.length; ++n < l; ) if (t(e[n], n, e)) return !0;
  return !1;
}
var u = r;
export { u as _ };
