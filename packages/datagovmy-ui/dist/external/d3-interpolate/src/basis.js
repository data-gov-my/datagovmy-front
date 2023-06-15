function u(n, f, i, r, c) {
  var o = n * n,
    a = o * n;
  return (
    ((1 - 3 * n + 3 * o - a) * f +
      (4 - 6 * o + 3 * a) * i +
      (1 + 3 * n + 3 * o - 3 * a) * r +
      a * c) /
    6
  );
}
function v(n) {
  var f = n.length - 1;
  return function (i) {
    var r = i <= 0 ? (i = 0) : i >= 1 ? ((i = 1), f - 1) : Math.floor(i * f),
      c = n[r],
      o = n[r + 1],
      a = r > 0 ? n[r - 1] : 2 * c - o,
      t = r < f - 1 ? n[r + 2] : 2 * o - c;
    return u((i - r / f) * f, a, c, o, t);
  };
}
export { u as basis, v as default };
