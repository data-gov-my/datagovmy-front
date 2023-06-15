import { _ as c } from "./_Symbol.js";
var a = c,
  e = Object.prototype,
  s = e.hasOwnProperty,
  y = e.toString,
  t = a ? a.toStringTag : void 0;
function f(r) {
  var o = s.call(r, t),
    n = r[t];
  try {
    r[t] = void 0;
    var i = !0;
  } catch {}
  var g = y.call(r);
  return i && (o ? (r[t] = n) : delete r[t]), g;
}
var T = f;
export { T as _ };
