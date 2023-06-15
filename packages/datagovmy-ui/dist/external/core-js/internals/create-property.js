import { t as p } from "./to-property-key.js";
import "./object-define-property.js";
import { c as a } from "./create-property-descriptor.js";
import { __exports as i } from "../../../_virtual/object-define-property.js";
var y = p,
  f = i,
  s = a,
  v = function (r, t, o) {
    var e = y(t);
    e in r ? f.f(r, e, s(0, o)) : (r[e] = o);
  };
export { v as c };
