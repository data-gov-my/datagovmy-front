import { _ as t } from "./_LazyWrapper.js";
import { _ as a } from "./_LodashWrapper.js";
import { _ as e } from "./_baseLodash.js";
import { i as s } from "./isArray.js";
import { i } from "./isObjectLike.js";
import { _ as n } from "./_wrapperClone.js";
var _ = t,
  p = a,
  f = e,
  m = s,
  c = i,
  y = n,
  L = Object.prototype,
  h = L.hasOwnProperty;
function o(r) {
  if (c(r) && !m(r) && !(r instanceof _)) {
    if (r instanceof p) return r;
    if (h.call(r, "__wrapped__")) return y(r);
  }
  return new p(r);
}
o.prototype = f.prototype;
o.prototype.constructor = o;
var P = o;
export { P as w };
