import { _ as t } from "./_getMapData.js";
var r = t;
function p(e) {
  var a = r(this, e).delete(e);
  return (this.size -= a ? 1 : 0), a;
}
var i = p;
export { i as _ };
