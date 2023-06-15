import e from "./setPrototypeOf.js";
function p(t, o) {
  (t.prototype = Object.create(o.prototype)), (t.prototype.constructor = t), e(t, o);
}
export { p as default };
