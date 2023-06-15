import { _ as s } from "./_getWrapDetails.js";
import { _ as i } from "./_insertWrapDetails.js";
import { _ as o } from "./_setToString.js";
import { _ as p } from "./_updateWrapDetails.js";
var _ = s,
  n = i,
  m = o,
  W = p;
function g(t, a, e) {
  var r = a + "";
  return m(t, n(r, W(_(r), e)));
}
var S = g;
export { S as _ };
