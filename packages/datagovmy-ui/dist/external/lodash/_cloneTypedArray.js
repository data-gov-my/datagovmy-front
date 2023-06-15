import { _ as n } from "./_cloneArrayBuffer.js";
var o = n;
function u(r, f) {
  var e = f ? o(r.buffer) : r.buffer;
  return new r.constructor(e, r.byteOffset, r.length);
}
var a = u;
export { a as _ };
