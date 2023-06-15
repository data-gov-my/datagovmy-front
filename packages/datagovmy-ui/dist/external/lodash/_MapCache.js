import { _ as r } from "./_mapCacheClear.js";
import { _ as m } from "./_mapCacheDelete.js";
import { _ as h } from "./_mapCacheGet.js";
import { _ as c } from "./_mapCacheHas.js";
import { _ as C } from "./_mapCacheSet.js";
var l = r,
  _ = m,
  s = h,
  i = c,
  f = C;
function a(e) {
  var p = -1,
    o = e == null ? 0 : e.length;
  for (this.clear(); ++p < o; ) {
    var t = e[p];
    this.set(t[0], t[1]);
  }
}
a.prototype.clear = l;
a.prototype.delete = _;
a.prototype.get = s;
a.prototype.has = i;
a.prototype.set = f;
var u = a;
export { u as _ };
