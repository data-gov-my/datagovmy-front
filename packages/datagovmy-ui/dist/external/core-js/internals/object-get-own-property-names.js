import { __exports as t } from "../../../_virtual/object-get-own-property-names.js";
import { o as r } from "./object-keys-internal.js";
import { e as o } from "./enum-bug-keys.js";
var n = r,
  a = o,
  s = a.concat("length", "prototype");
t.f =
  Object.getOwnPropertyNames ||
  function (e) {
    return n(e, s);
  };
export { t as default };
