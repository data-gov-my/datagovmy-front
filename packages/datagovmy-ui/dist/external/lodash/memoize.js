import { _ as p } from "./_MapCache.js";
var o = p,
  m = "Expected a function";
function r(i, a) {
  if (typeof i != "function" || (a != null && typeof a != "function")) throw new TypeError(m);
  var e = function () {
    var c = arguments,
      n = a ? a.apply(this, c) : c[0],
      t = e.cache;
    if (t.has(n)) return t.get(n);
    var h = i.apply(this, c);
    return (e.cache = t.set(n, h) || t), h;
  };
  return (e.cache = new (r.Cache || o)()), e;
}
r.Cache = o;
var f = r;
export { f as m };
