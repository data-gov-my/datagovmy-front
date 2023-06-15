import { _ as t } from "./_nativeCreate.js";
var e = t,
  o = Object.prototype,
  n = o.hasOwnProperty;
function s(a) {
  var r = this.__data__;
  return e ? r[a] !== void 0 : n.call(r, a);
}
var h = s;
export { h as _ };
