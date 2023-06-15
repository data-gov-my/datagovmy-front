import { t as I } from "./to-integer-or-infinity.js";
var e, n;
function m() {
  if (n) return e;
  n = 1;
  var i = I,
    a = Math.max,
    o = Math.min;
  return (
    (e = function (u, t) {
      var r = i(u);
      return r < 0 ? a(r + t, 0) : o(r, t);
    }),
    e
  );
}
export { m as __require };
