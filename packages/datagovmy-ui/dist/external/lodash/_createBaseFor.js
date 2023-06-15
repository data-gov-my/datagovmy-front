function o(i) {
  return function (e, l, s) {
    for (var f = -1, r = Object(e), a = s(e), n = a.length; n--; ) {
      var t = a[i ? n : ++f];
      if (l(r[t], t, r) === !1) break;
    }
    return e;
  };
}
var u = o;
export { u as _ };
