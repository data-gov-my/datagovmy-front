import { o as r } from "./object-keys-internal.js";
import { e as t } from "./enum-bug-keys.js";
var o = r,
  s = t,
  m =
    Object.keys ||
    function (e) {
      return o(e, s);
    };
export { m as o };
