import { c as o } from "./classof-raw.js";
var e, r;
function i() {
  if (r) return e;
  r = 1;
  var s = o;
  return (e = typeof process < "u" && s(process) == "process"), e;
}
export { i as __require };
