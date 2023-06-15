import { _ as a } from "./_baseCreate.js";
import { _ as e } from "./_baseLodash.js";
var r = a,
  s = e,
  o = 4294967295;
function _(t) {
  (this.__wrapped__ = t),
    (this.__actions__ = []),
    (this.__dir__ = 1),
    (this.__filtered__ = !1),
    (this.__iteratees__ = []),
    (this.__takeCount__ = o),
    (this.__views__ = []);
}
_.prototype = r(s.prototype);
_.prototype.constructor = _;
var h = _;
export { h as _ };
