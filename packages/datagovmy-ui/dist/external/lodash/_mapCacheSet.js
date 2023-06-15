import { _ as i } from "./_getMapData.js";
var r = i;
function p(t, e) {
  var a = r(this, t),
    s = a.size;
  return a.set(t, e), (this.size += a.size == s ? 0 : 1), this;
}
var m = p;
export { m as _ };
