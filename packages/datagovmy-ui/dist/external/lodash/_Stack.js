import { _ as s } from "./_ListCache.js";
import { _ as o } from "./_stackClear.js";
import { _ as r } from "./_stackDelete.js";
import { _ } from "./_stackGet.js";
import { _ as p } from "./_stackHas.js";
import { _ as c } from "./_stackSet.js";
var i = s,
  k = o,
  m = r,
  f = _,
  l = p,
  h = c;
function t(a) {
  var e = (this.__data__ = new i(a));
  this.size = e.size;
}
t.prototype.clear = k;
t.prototype.delete = m;
t.prototype.get = f;
t.prototype.has = l;
t.prototype.set = h;
var z = t;
export { z as _ };
