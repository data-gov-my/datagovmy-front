import { _ as a } from "../internals/export.js";
import { g as m } from "../internals/get-built-in.js";
import { h as e } from "../internals/has-own-property.js";
import { t as g } from "../internals/to-string.js";
import { s as n } from "../internals/shared.js";
import { s as y } from "../internals/symbol-registry-detection.js";
var f = a,
  l = m,
  v = e,
  S = g,
  s = n,
  p = y,
  o = s("string-to-symbol-registry"),
  b = s("symbol-to-string-registry");
f(
  { target: "Symbol", stat: !0, forced: !p },
  {
    for: function (i) {
      var r = S(i);
      if (v(o, r)) return o[r];
      var t = l("Symbol")(r);
      return (o[r] = t), (b[t] = r), t;
    },
  }
);
