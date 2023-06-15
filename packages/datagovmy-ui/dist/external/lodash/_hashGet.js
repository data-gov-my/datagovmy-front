import { _ as e } from "./_nativeCreate.js";
var _ = e,
  n = "__lodash_hash_undefined__",
  o = Object.prototype,
  h = o.hasOwnProperty;
function d(a) {
  var r = this.__data__;
  if (_) {
    var t = r[a];
    return t === n ? void 0 : t;
  }
  return h.call(r, a) ? r[a] : void 0;
}
var v = d;
export { v as _ };
