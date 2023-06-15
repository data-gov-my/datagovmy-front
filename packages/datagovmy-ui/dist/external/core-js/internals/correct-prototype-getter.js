import { f as o } from "./fails.js";
var r = o,
  c = !r(function () {
    function t() {}
    return (t.prototype.constructor = null), Object.getPrototypeOf(new t()) !== t.prototype;
  });
export { c };
