import { u as m } from "../utils.js";
var i, c;
function w() {
  if (c) return i;
  c = 1;
  var o = m;
  return (
    (i = o.isStandardBrowserEnv()
      ? // Standard browser envs support document.cookie
        (function () {
          return {
            write: function (n, t, u, s, a, f) {
              var e = [];
              e.push(n + "=" + encodeURIComponent(t)),
                o.isNumber(u) && e.push("expires=" + new Date(u).toGMTString()),
                o.isString(s) && e.push("path=" + s),
                o.isString(a) && e.push("domain=" + a),
                f === !0 && e.push("secure"),
                (document.cookie = e.join("; "));
            },
            read: function (n) {
              var t = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
              return t ? decodeURIComponent(t[3]) : null;
            },
            remove: function (n) {
              this.write(n, "", Date.now() - 864e5);
            },
          };
        })()
      : // Non standard browser env (web workers, react-native) lack needed support.
        (function () {
          return {
            write: function () {},
            read: function () {
              return null;
            },
            remove: function () {},
          };
        })()),
    i
  );
}
export { w as __require };
