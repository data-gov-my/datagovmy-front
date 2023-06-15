import { _ as s } from "./_assocIndexOf.js";
var i = s,
  l = Array.prototype,
  o = l.splice;
function n(r) {
  var e = this.__data__,
    a = i(e, r);
  if (a < 0) return !1;
  var t = e.length - 1;
  return a == t ? e.pop() : o.call(e, a, 1), --this.size, !0;
}
var p = n;
export { p as _ };
