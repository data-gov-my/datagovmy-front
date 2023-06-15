import { __exports as p } from "../../../_virtual/object-property-is-enumerable.js";
var e = {}.propertyIsEnumerable,
  t = Object.getOwnPropertyDescriptor,
  a = t && !e.call({ 1: 2 }, 1);
p.f = a
  ? function (o) {
      var r = t(this, o);
      return !!r && r.enumerable;
    }
  : e;
export { p as default };
