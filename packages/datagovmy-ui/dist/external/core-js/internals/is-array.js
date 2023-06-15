import { c as i } from "./classof-raw.js";
var r, a;
function o() {
  if (a) return r;
  a = 1;
  var s = i;
  return (
    (r =
      Array.isArray ||
      function (e) {
        return s(e) == "Array";
      }),
    r
  );
}
export { o as __require };
