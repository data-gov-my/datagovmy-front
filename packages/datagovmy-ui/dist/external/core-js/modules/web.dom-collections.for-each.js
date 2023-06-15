import { __exports as i } from "../../../_virtual/web.dom-collections.for-each.js";
import { g as n } from "../internals/global.js";
import { d as p } from "../internals/dom-iterables.js";
import { d as h } from "../internals/dom-token-list-prototype.js";
import { __require as u } from "../internals/array-for-each.js";
import { c as _ } from "../internals/create-non-enumerable-property.js";
var m;
function g() {
  if (m) return i;
  m = 1;
  var a = n,
    t = p,
    s = h,
    o = u(),
    c = _,
    f = function (r) {
      if (r && r.forEach !== o)
        try {
          c(r, "forEach", o);
        } catch {
          r.forEach = o;
        }
    };
  for (var e in t) t[e] && f(a[e] && a[e].prototype);
  return f(s), i;
}
export { g as __require };
