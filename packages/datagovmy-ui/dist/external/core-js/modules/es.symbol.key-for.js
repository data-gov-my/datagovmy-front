import { _ as t } from "../internals/export.js";
import { h as i } from "../internals/has-own-property.js";
import { i as s } from "../internals/is-symbol.js";
import { t as a } from "../internals/try-to-string.js";
import { s as e } from "../internals/shared.js";
import { s as m } from "../internals/symbol-registry-detection.js";
var y = t,
  n = i,
  f = s,
  p = a,
  S = e,
  g = m,
  o = S("symbol-to-string-registry");
y(
  { target: "Symbol", stat: !0, forced: !g },
  {
    keyFor: function (r) {
      if (!f(r)) throw TypeError(p(r) + " is not a symbol");
      if (n(o, r)) return o[r];
    },
  }
);
