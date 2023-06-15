import { m as o } from "./make-built-in.js";
import "./object-define-property.js";
import { __exports as i } from "../../../_virtual/object-define-property.js";
var r = o,
  n = i,
  s = function (f, e, t) {
    return t.get && r(t.get, e, { getter: !0 }), t.set && r(t.set, e, { setter: !0 }), n.f(f, e, t);
  };
export { s as d };
