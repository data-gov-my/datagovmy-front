import { _ as o } from "./_hashClear.js";
import { _ as r } from "./_hashDelete.js";
import { _ as p } from "./_hashGet.js";
import { _ as l } from "./_hashHas.js";
import { _ } from "./_hashSet.js";
var m = o,
  i = r,
  f = p,
  v = l,
  y = _;
function a(h) {
  var t = -1,
    s = h == null ? 0 : h.length;
  for (this.clear(); ++t < s; ) {
    var e = h[t];
    this.set(e[0], e[1]);
  }
}
a.prototype.clear = m;
a.prototype.delete = i;
a.prototype.get = f;
a.prototype.has = v;
a.prototype.set = y;
var u = a;
export { u as _ };
