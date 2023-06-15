import { _ as m } from "./_realNames.js";
var o = m,
  s = Object.prototype,
  p = s.hasOwnProperty;
function u(e) {
  for (var r = e.name + "", a = o[r], t = p.call(o, r) ? a.length : 0; t--; ) {
    var n = a[t],
      l = n.func;
    if (l == null || l == e) return n.name;
  }
  return r;
}
var c = u;
export { c as _ };
