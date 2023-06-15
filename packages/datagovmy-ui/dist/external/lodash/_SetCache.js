import { _ as o } from "./_MapCache.js";
import { _ as p } from "./_setCacheAdd.js";
import { _ as r } from "./_setCacheHas.js";
var s = o,
  _ = p,
  d = r;
function a(t) {
  var e = -1,
    h = t == null ? 0 : t.length;
  for (this.__data__ = new s(); ++e < h; ) this.add(t[e]);
}
a.prototype.add = a.prototype.push = _;
a.prototype.has = d;
var n = a;
export { n as _ };
