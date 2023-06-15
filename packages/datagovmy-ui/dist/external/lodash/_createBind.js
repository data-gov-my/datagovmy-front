import { _ as s } from "./_createCtor.js";
import { _ } from "./_root.js";
var p = s,
  c = _,
  f = 1;
function m(r, a, o) {
  var e = a & f,
    i = p(r);
  function t() {
    var n = this && this !== c && this instanceof t ? i : r;
    return n.apply(e ? o : this, arguments);
  }
  return t;
}
var u = m;
export { u as _ };
