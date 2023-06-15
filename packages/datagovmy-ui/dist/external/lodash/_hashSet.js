import { _ as e } from "./_nativeCreate.js";
var h = e,
  s = "__lodash_hash_undefined__";
function i(a, t) {
  var _ = this.__data__;
  return (this.size += this.has(a) ? 0 : 1), (_[a] = h && t === void 0 ? s : t), this;
}
var n = i;
export { n as _ };
