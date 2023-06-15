import { __module as o } from "../../_virtual/_nodeUtil.js";
import { _ as l } from "./_freeGlobal.js";
o.exports;
(function (e, t) {
  var s = l,
    n = t && !t.nodeType && t,
    r = n && !0 && e && !e.nodeType && e,
    p = r && r.exports === n,
    i = p && s.process,
    f = (function () {
      try {
        var a = r && r.require && r.require("util").types;
        return a || (i && i.binding && i.binding("util"));
      } catch {}
    })();
  e.exports = f;
})(o, o.exports);
var d = o.exports;
export { d as _ };
