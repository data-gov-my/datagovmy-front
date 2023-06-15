import { _ as m } from "./_baseTimes.js";
import { i as g } from "./isArguments.js";
import { i as _ } from "./isArray.js";
import { i as h } from "./isBuffer.js";
import { _ as y } from "./_isIndex.js";
import { i as A } from "./isTypedArray.js";
var b = m,
  d = g,
  x = _,
  T = h,
  c = y,
  u = A,
  O = Object.prototype,
  B = O.hasOwnProperty;
function I(s, n) {
  var i = x(s),
    t = !i && d(s),
    e = !i && !t && T(s),
    a = !i && !t && !e && u(s),
    f = i || t || e || a,
    o = f ? b(s.length, String) : [],
    p = o.length;
  for (var r in s)
    (n || B.call(s, r)) &&
      !(
        f && // Safari 9 has enumerable `arguments.length` in strict mode.
        (r == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          (e && (r == "offset" || r == "parent")) || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          (a && (r == "buffer" || r == "byteLength" || r == "byteOffset")) || // Skip index properties.
          c(r, p))
      ) &&
      o.push(r);
  return o;
}
var E = I;
export { E as _ };
