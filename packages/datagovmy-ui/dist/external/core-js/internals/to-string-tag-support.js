import { w as a } from "./well-known-symbol.js";
var r, o;
function S() {
  if (o) return r;
  o = 1;
  var e = a,
    n = e("toStringTag"),
    t = {};
  return (t[n] = "z"), (r = String(t) === "[object z]"), r;
}
export { S as __require };
