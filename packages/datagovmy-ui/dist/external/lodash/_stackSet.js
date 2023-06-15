import { _ as i } from "./_ListCache.js";
import { _ as e } from "./_Map.js";
import { _ as r } from "./_MapCache.js";
var h = i,
  o = e,
  c = r,
  n = 200;
function f(_, s) {
  var t = this.__data__;
  if (t instanceof h) {
    var a = t.__data__;
    if (!o || a.length < n - 1) return a.push([_, s]), (this.size = ++t.size), this;
    t = this.__data__ = new c(a);
  }
  return t.set(_, s), (this.size = t.size), this;
}
var v = f;
export { v as _ };
