import { _ as o } from "./_listCacheClear.js";
import { _ as r } from "./_listCacheDelete.js";
import { _ as i } from "./_listCacheGet.js";
import { _ as h } from "./_listCacheHas.js";
import { _ as p } from "./_listCacheSet.js";
var c = o,
  C = r,
  _ = i,
  m = h,
  f = p;
function t(e) {
  var a = -1,
    l = e == null ? 0 : e.length;
  for (this.clear(); ++a < l; ) {
    var s = e[a];
    this.set(s[0], s[1]);
  }
}
t.prototype.clear = c;
t.prototype.delete = C;
t.prototype.get = _;
t.prototype.has = m;
t.prototype.set = f;
var u = t;
export { u as _ };
