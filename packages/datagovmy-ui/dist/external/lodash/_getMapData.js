import { _ as e } from "./_isKeyable.js";
var _ = e;
function s(r, a) {
  var t = r.__data__;
  return _(a) ? t[typeof a == "string" ? "string" : "hash"] : t.map;
}
var p = s;
export { p as _ };
