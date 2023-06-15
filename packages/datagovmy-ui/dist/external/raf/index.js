import { commonjsGlobal as v } from "../../_virtual/_commonjsHelpers.js";
import { __module as s } from "../../_virtual/index5.js";
import { p as x } from "./node_modules/performance-now/lib/performance-now.js";
var w = x,
  r = typeof window > "u" ? v : window,
  m = ["moz", "webkit"],
  e = "AnimationFrame",
  t = r["request" + e],
  l = r["cancel" + e] || r["cancelRequest" + e];
for (var c = 0; !t && c < m.length; c++)
  (t = r[m[c] + "Request" + e]), (l = r[m[c] + "Cancel" + e] || r[m[c] + "CancelRequest" + e]);
if (!t || !l) {
  var p = 0,
    d = 0,
    o = [],
    g = 1e3 / 60;
  (t = function (n) {
    if (o.length === 0) {
      var a = w(),
        h = Math.max(0, g - (a - p));
      (p = h + a),
        setTimeout(function () {
          var i = o.slice(0);
          o.length = 0;
          for (var f = 0; f < i.length; f++)
            if (!i[f].cancelled)
              try {
                i[f].callback(p);
              } catch (u) {
                setTimeout(function () {
                  throw u;
                }, 0);
              }
        }, Math.round(h));
    }
    return (
      o.push({
        handle: ++d,
        callback: n,
        cancelled: !1,
      }),
      d
    );
  }),
    (l = function (n) {
      for (var a = 0; a < o.length; a++) o[a].handle === n && (o[a].cancelled = !0);
    });
}
s.exports = function (n) {
  return t.call(r, n);
};
s.exports.cancel = function () {
  l.apply(r, arguments);
};
s.exports.polyfill = function (n) {
  n || (n = r), (n.requestAnimationFrame = t), (n.cancelAnimationFrame = l);
};
var F = s.exports;
export { F as r };
