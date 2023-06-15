import { d as t } from "./descriptors.js";
import "./object-define-property.js";
import { c as p } from "./create-property-descriptor.js";
import { __exports as a } from "../../../_virtual/object-define-property.js";
var i = t,
  c = a,
  n = p,
  P = i
    ? function (r, e, o) {
        return c.f(r, e, n(1, o));
      }
    : function (r, e, o) {
        return (r[e] = o), r;
      };
export { P as c };
