import { _ as e } from "./_baseCreate.js";
import { _ as o } from "./_baseLodash.js";
var r = e,
  s = o;
function _(a, t) {
  (this.__wrapped__ = a),
    (this.__actions__ = []),
    (this.__chain__ = !!t),
    (this.__index__ = 0),
    (this.__values__ = void 0);
}
_.prototype = r(s.prototype);
_.prototype.constructor = _;
var h = _;
export { h as _ };
