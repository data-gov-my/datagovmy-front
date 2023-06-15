import { __module as n } from "../../../../_virtual/iterableToArrayLimit.js";
var p;
function m() {
  return p
    ? n.exports
    : ((p = 1),
      (function (r) {
        function c(t, u) {
          var e = t == null ? null : (typeof Symbol < "u" && t[Symbol.iterator]) || t["@@iterator"];
          if (e != null) {
            var a,
              f,
              s,
              l,
              o = [],
              i = !0,
              y = !1;
            try {
              if (((s = (e = e.call(t)).next), u === 0)) {
                if (Object(e) !== e) return;
                i = !1;
              } else
                for (; !(i = (a = s.call(e)).done) && (o.push(a.value), o.length !== u); i = !0);
            } catch (b) {
              (y = !0), (f = b);
            } finally {
              try {
                if (!i && e.return != null && ((l = e.return()), Object(l) !== l)) return;
              } finally {
                if (y) throw f;
              }
            }
            return o;
          }
        }
        (r.exports = c), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(n),
      n.exports);
}
export { m as __require };
