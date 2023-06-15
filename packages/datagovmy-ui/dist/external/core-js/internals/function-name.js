import { d as a } from "./descriptors.js";
import { h as e } from "./has-own-property.js";
var r = a,
  n = e,
  t = Function.prototype,
  i = r && Object.getOwnPropertyDescriptor,
  o = n(t, "name"),
  p = o && function () {}.name === "something",
  s = o && (!r || (r && i(t, "name").configurable)),
  v = {
    EXISTS: o,
    PROPER: p,
    CONFIGURABLE: s,
  };
export { v as f };
