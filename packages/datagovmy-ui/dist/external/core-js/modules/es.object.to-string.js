import { __exports as r } from "../../../_virtual/es.object.to-string.js";
import { __require as _ } from "../internals/to-string-tag-support.js";
import { d as n } from "../internals/define-built-in.js";
import { __require as u } from "../internals/object-to-string.js";
var t;
function S() {
  if (t) return r;
  t = 1;
  var e = _(),
    i = n,
    o = u();
  return e || i(Object.prototype, "toString", o, { unsafe: !0 }), r;
}
export { S as __require };
