import { t as o } from "./toNumber.js";
var n = o,
  t = 1 / 0,
  N = 17976931348623157e292;
function f(r) {
  if (!r) return r === 0 ? r : 0;
  if (((r = n(r)), r === t || r === -t)) {
    var i = r < 0 ? -1 : 1;
    return i * N;
  }
  return r === r ? r : 0;
}
var I = f;
export { I as t };
