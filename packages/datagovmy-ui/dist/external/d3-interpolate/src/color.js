import u from "./constant.js";
function o(t, r) {
  return function (n) {
    return t + n * r;
  };
}
function i(t, r, n) {
  return (
    (t = Math.pow(t, n)),
    (r = Math.pow(r, n) - t),
    (n = 1 / n),
    function (e) {
      return Math.pow(t + e * r, n);
    }
  );
}
function a(t, r) {
  var n = r - t;
  return n ? o(t, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : u(isNaN(t) ? r : t);
}
function m(t) {
  return (t = +t) == 1
    ? f
    : function (r, n) {
        return n - r ? i(r, n, t) : u(isNaN(r) ? n : r);
      };
}
function f(t, r) {
  var n = r - t;
  return n ? o(t, n) : u(isNaN(t) ? r : t);
}
export { f as default, m as gamma, a as hue };
