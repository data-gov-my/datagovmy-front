import { d } from "./descriptors.js";
import { f as j } from "./function-uncurry-this.js";
import { o as I } from "./object-keys.js";
import { t as O } from "./to-indexed-object.js";
import "./object-property-is-enumerable.js";
import { __exports as T } from "../../../_virtual/object-property-is-enumerable.js";
var t, i;
function $() {
  if (i) return t;
  i = 1;
  var v = d,
    a = j,
    c = I,
    p = O,
    f = T.f,
    m = a(f),
    y = a([].push),
    o = function (b) {
      return function (h) {
        for (var e = p(h), s = c(e), l = s.length, n = 0, u = [], r; l > n; )
          (r = s[n++]), (!v || m(e, r)) && y(u, b ? [r, e[r]] : e[r]);
        return u;
      };
    };
  return (
    (t = {
      // `Object.entries` method
      // https://tc39.es/ecma262/#sec-object.entries
      entries: o(!0),
      // `Object.values` method
      // https://tc39.es/ecma262/#sec-object.values
      values: o(!1),
    }),
    t
  );
}
export { $ as __require };
