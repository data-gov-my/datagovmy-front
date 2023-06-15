import { u as s } from "../utils.js";
var a = s;
function n() {
  this.handlers = [];
}
n.prototype.use = function (r, h, e) {
  return (
    this.handlers.push({
      fulfilled: r,
      rejected: h,
      synchronous: e ? e.synchronous : !1,
      runWhen: e ? e.runWhen : null,
    }),
    this.handlers.length - 1
  );
};
n.prototype.eject = function (r) {
  this.handlers[r] && (this.handlers[r] = null);
};
n.prototype.forEach = function (r) {
  a.forEach(this.handlers, function (e) {
    e !== null && r(e);
  });
};
var u = n;
export { u as I };
