import { rgb as t } from "../../node_modules/d3-color/src/color.js";
var i = t(),
  n = Math.PI / 3,
  e = (Math.PI * 2) / 3;
function o(r) {
  var a;
  return (
    (r = (0.5 - r) * Math.PI),
    (i.r = 255 * (a = Math.sin(r)) * a),
    (i.g = 255 * (a = Math.sin(r + n)) * a),
    (i.b = 255 * (a = Math.sin(r + e)) * a),
    i + ""
  );
}
export { o as default };
