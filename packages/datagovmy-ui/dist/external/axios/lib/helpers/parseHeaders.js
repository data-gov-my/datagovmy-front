import { u as d } from "../utils.js";
var o, f;
function v() {
  if (f) return o;
  f = 1;
  var a = d,
    u = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent",
    ];
  return (
    (o = function (n) {
      var e = {},
        r,
        t,
        i;
      return (
        n &&
          a.forEach(
            n.split(`
`),
            function (s) {
              if (
                ((i = s.indexOf(":")),
                (r = a.trim(s.substr(0, i)).toLowerCase()),
                (t = a.trim(s.substr(i + 1))),
                r)
              ) {
                if (e[r] && u.indexOf(r) >= 0) return;
                r === "set-cookie"
                  ? (e[r] = (e[r] ? e[r] : []).concat([t]))
                  : (e[r] = e[r] ? e[r] + ", " + t : t);
              }
            }
          ),
        e
      );
    }),
    o
  );
}
export { v as __require };
