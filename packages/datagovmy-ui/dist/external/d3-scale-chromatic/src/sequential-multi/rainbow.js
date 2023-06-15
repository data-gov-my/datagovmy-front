import { cubehelixLong as i } from "../../../d3-interpolate/src/cubehelix.js";
import o from "../../node_modules/d3-color/src/cubehelix.js";
var n = i(o(-100, 0.75, 0.35), o(80, 1.5, 0.8)),
  t = i(o(260, 0.75, 0.35), o(80, 1.5, 0.8)),
  a = o();
function c(r) {
  (r < 0 || r > 1) && (r -= Math.floor(r));
  var e = Math.abs(r - 0.5);
  return (a.h = 360 * r - 100), (a.s = 1.5 - 1.5 * e), (a.l = 0.8 - 0.9 * e), a + "";
}
export { t as cool, c as default, n as warm };
