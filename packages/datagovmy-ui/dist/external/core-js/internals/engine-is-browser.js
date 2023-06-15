import { __require as o } from "./engine-is-deno.js";
import { __require as s } from "./engine-is-node.js";
var e, r;
function a() {
  if (r) return e;
  r = 1;
  var i = o(),
    n = s();
  return (e = !i && !n && typeof window == "object" && typeof document == "object"), e;
}
export { a as __require };
