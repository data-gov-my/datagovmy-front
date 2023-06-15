import { w as c } from "./well-known-symbol.js";
var f = c,
  o = f("iterator"),
  a = !1;
try {
  var i = 0,
    e = {
      next: function () {
        return { done: !!i++ };
      },
      return: function () {
        a = !0;
      },
    };
  (e[o] = function () {
    return this;
  }),
    Array.from(e, function () {
      throw 2;
    });
} catch {}
var v = function (r, u) {
  if (!u && !a) return !1;
  var n = !1;
  try {
    var t = {};
    (t[o] = function () {
      return {
        next: function () {
          return { done: (n = !0) };
        },
      };
    }),
      r(t);
  } catch {}
  return n;
};
export { v as c };
