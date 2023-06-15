import { __module as o } from "../../_virtual/_cloneBuffer.js";
import { _ as x } from "./_root.js";
o.exports;
(function (e, t) {
  var l = x,
    n = t && !t.nodeType && t,
    f = n && !0 && e && !e.nodeType && e,
    u = f && f.exports === n,
    a = u ? l.Buffer : void 0,
    s = a ? a.allocUnsafe : void 0;
  function i(r, v) {
    if (v) return r.slice();
    var c = r.length,
      p = s ? s(c) : new r.constructor(c);
    return r.copy(p), p;
  }
  e.exports = i;
})(o, o.exports);
var B = o.exports;
export { B as _ };
