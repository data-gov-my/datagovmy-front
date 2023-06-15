import { g as t } from "./get-built-in.js";
import { i as a } from "./is-callable.js";
import { o as e } from "./object-is-prototype-of.js";
import { u as i } from "./use-symbol-as-uid.js";
var l = t,
  m = a,
  s = e,
  b = i,
  p = Object,
  v = b
    ? function (o) {
        return typeof o == "symbol";
      }
    : function (o) {
        var r = l("Symbol");
        return m(r) && s(r.prototype, p(o));
      };
export { v as i };
