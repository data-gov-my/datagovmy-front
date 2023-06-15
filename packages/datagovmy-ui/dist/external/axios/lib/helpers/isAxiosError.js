import { u as e } from "../utils.js";
var r, s;
function n() {
  if (s) return r;
  s = 1;
  var o = e;
  return (
    (r = function (i) {
      return o.isObject(i) && i.isAxiosError === !0;
    }),
    r
  );
}
export { n as __require };
