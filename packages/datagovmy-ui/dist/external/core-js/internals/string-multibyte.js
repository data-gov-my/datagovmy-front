import { f as v } from "./function-uncurry-this.js";
import { t as h } from "./to-integer-or-infinity.js";
import { t as m } from "./to-string.js";
import { r as x } from "./require-object-coercible.js";
var a = v,
  d = h,
  g = m,
  l = x,
  p = a("".charAt),
  c = a("".charCodeAt),
  A = a("".slice),
  s = function (i) {
    return function (f, u) {
      var t = g(l(f)),
        r = d(u),
        o = t.length,
        e,
        n;
      return r < 0 || r >= o
        ? i
          ? ""
          : void 0
        : ((e = c(t, r)),
          e < 55296 || e > 56319 || r + 1 === o || (n = c(t, r + 1)) < 56320 || n > 57343
            ? i
              ? p(t, r)
              : e
            : i
            ? A(t, r, r + 2)
            : ((e - 55296) << 10) + (n - 56320) + 65536);
    };
  },
  C = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: s(!1),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: s(!0),
  };
export { C as s };
