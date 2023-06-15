import { __require as E } from "./lib/ReactPropTypesSecret.js";
import { __require as _ } from "./lib/has.js";
var f, v;
function P() {
  if (v) return f;
  v = 1;
  var o = function () {};
  if (process.env.NODE_ENV !== "production") {
    var y = E(),
      t = {},
      d = _();
    o = function (n) {
      var a = "Warning: " + n;
      typeof console < "u" && console.error(a);
      try {
        throw new Error(a);
      } catch {}
    };
  }
  function u(n, a, i, s, c) {
    if (process.env.NODE_ENV !== "production") {
      for (var e in n)
        if (d(n, e)) {
          var r;
          try {
            if (typeof n[e] != "function") {
              var h = Error(
                (s || "React class") +
                  ": " +
                  i +
                  " type `" +
                  e +
                  "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                  typeof n[e] +
                  "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw ((h.name = "Invariant Violation"), h);
            }
            r = n[e](a, e, s, i, null, y);
          } catch (l) {
            r = l;
          }
          if (
            (r &&
              !(r instanceof Error) &&
              o(
                (s || "React class") +
                  ": type specification of " +
                  i +
                  " `" +
                  e +
                  "` is invalid; the type checker function must return `null` or an `Error` but returned a " +
                  typeof r +
                  ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
              ),
            r instanceof Error && !(r.message in t))
          ) {
            t[r.message] = !0;
            var p = c ? c() : "";
            o("Failed " + i + " type: " + r.message + (p ?? ""));
          }
        }
    }
  }
  return (
    (u.resetWarningCache = function () {
      process.env.NODE_ENV !== "production" && (t = {});
    }),
    (f = u),
    f
  );
}
export { P as __require };
