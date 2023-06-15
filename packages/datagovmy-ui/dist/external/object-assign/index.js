/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var f, i;
function p() {
  if (i) return f;
  i = 1;
  var u = Object.getOwnPropertySymbols,
    b = Object.prototype.hasOwnProperty,
    l = Object.prototype.propertyIsEnumerable;
  function O(n) {
    if (n == null) throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(n);
  }
  function j() {
    try {
      if (!Object.assign) return !1;
      var n = new String("abc");
      if (((n[5] = "de"), Object.getOwnPropertyNames(n)[0] === "5")) return !1;
      for (var s = {}, r = 0; r < 10; r++) s["_" + String.fromCharCode(r)] = r;
      var a = Object.getOwnPropertyNames(s).map(function (e) {
        return s[e];
      });
      if (a.join("") !== "0123456789") return !1;
      var t = {};
      return (
        "abcdefghijklmnopqrst".split("").forEach(function (e) {
          t[e] = e;
        }),
        Object.keys(Object.assign({}, t)).join("") === "abcdefghijklmnopqrst"
      );
    } catch {
      return !1;
    }
  }
  return (
    (f = j()
      ? Object.assign
      : function (n, s) {
          for (var r, a = O(n), t, e = 1; e < arguments.length; e++) {
            r = Object(arguments[e]);
            for (var c in r) b.call(r, c) && (a[c] = r[c]);
            if (u) {
              t = u(r);
              for (var o = 0; o < t.length; o++) l.call(r, t[o]) && (a[t[o]] = r[t[o]]);
            }
          }
          return a;
        }),
    f
  );
}
export { p as __require };
