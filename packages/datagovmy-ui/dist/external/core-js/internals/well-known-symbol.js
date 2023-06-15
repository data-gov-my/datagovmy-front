import { g as a } from "./global.js";
import { s as l } from "./shared.js";
import { h as m } from "./has-own-property.js";
import { u as i } from "./uid.js";
import { s as S } from "./symbol-constructor-detection.js";
import { u as e } from "./use-symbol-as-uid.js";
var b = a,
  v = l,
  s = m,
  f = i,
  p = S,
  u = e,
  o = b.Symbol,
  t = v("wks"),
  w = u ? o.for || o : (o && o.withoutSetter) || f,
  O = function (r) {
    return s(t, r) || (t[r] = p && s(o, r) ? o[r] : w("Symbol." + r)), t[r];
  };
export { O as w };
