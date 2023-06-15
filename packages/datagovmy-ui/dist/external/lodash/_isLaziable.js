import { _ as o } from "./_LazyWrapper.js";
import { _ as p } from "./_getData.js";
import { _ as i } from "./_getFuncName.js";
import { w as m } from "./wrapperLodash.js";
var s = o,
  f = p,
  n = i,
  _ = m;
function u(a) {
  var t = n(a),
    r = _[t];
  if (typeof r != "function" || !(t in s.prototype)) return !1;
  if (a === r) return !0;
  var e = f(r);
  return !!e && a === e[0];
}
var y = u;
export { y as _ };
