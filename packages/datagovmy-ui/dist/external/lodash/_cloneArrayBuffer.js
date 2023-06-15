import { _ as e } from "./_Uint8Array.js";
var t = e;
function o(r) {
  var n = new r.constructor(r.byteLength);
  return new t(n).set(new t(r)), n;
}
var c = o;
export { c as _ };
