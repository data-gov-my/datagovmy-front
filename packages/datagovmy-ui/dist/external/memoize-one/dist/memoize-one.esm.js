var s =
  Number.isNaN ||
  function (r) {
    return typeof r == "number" && r !== r;
  };
function o(e, r) {
  return !!(e === r || (s(e) && s(r)));
}
function g(e, r) {
  if (e.length !== r.length) return !1;
  for (var t = 0; t < e.length; t++) if (!o(e[t], r[t])) return !1;
  return !0;
}
function h(e, r) {
  r === void 0 && (r = g);
  var t,
    f = [],
    u,
    l = !1;
  function i() {
    for (var n = [], a = 0; a < arguments.length; a++) n[a] = arguments[a];
    return (
      (l && t === this && r(n, f)) || ((u = e.apply(this, n)), (l = !0), (t = this), (f = n)), u
    );
  }
  return i;
}
export { h as default };
