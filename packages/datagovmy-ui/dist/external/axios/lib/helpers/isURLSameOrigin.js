import { u as m } from "../utils.js";
var a, u;
function f() {
  if (u) return a;
  u = 1;
  var n = m;
  return (
    (a = n.isStandardBrowserEnv()
      ? // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        (function () {
          var o = /(msie|trident)/i.test(navigator.userAgent),
            r = document.createElement("a"),
            t;
          function i(s) {
            var e = s;
            return (
              o && (r.setAttribute("href", e), (e = r.href)),
              r.setAttribute("href", e),
              {
                href: r.href,
                protocol: r.protocol ? r.protocol.replace(/:$/, "") : "",
                host: r.host,
                search: r.search ? r.search.replace(/^\?/, "") : "",
                hash: r.hash ? r.hash.replace(/^#/, "") : "",
                hostname: r.hostname,
                port: r.port,
                pathname: r.pathname.charAt(0) === "/" ? r.pathname : "/" + r.pathname,
              }
            );
          }
          return (
            (t = i(window.location.href)),
            function (e) {
              var h = n.isString(e) ? i(e) : e;
              return h.protocol === t.protocol && h.host === t.host;
            }
          );
        })()
      : // Non standard browser envs (web workers, react-native) lack needed support.
        (function () {
          return function () {
            return !0;
          };
        })()),
    a
  );
}
export { f as __require };
