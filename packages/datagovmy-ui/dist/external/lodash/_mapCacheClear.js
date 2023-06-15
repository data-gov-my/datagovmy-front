import { _ as s } from "./_Hash.js";
import { _ as r } from "./_ListCache.js";
import { _ } from "./_Map.js";
var a = s,
  e = r,
  t = _;
function h() {
  (this.size = 0),
    (this.__data__ = {
      hash: new a(),
      map: new (t || e)(),
      string: new a(),
    });
}
var o = h;
export { o as _ };
