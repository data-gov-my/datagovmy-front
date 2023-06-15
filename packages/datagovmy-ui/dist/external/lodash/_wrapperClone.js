import { _ as r } from "./_LazyWrapper.js";
import { _ as o } from "./_LodashWrapper.js";
import { _ as n } from "./_copyArray.js";
var e = r,
  s = o,
  i = n;
function t(_) {
  if (_ instanceof e) return _.clone();
  var a = new s(_.__wrapped__, _.__chain__);
  return (
    (a.__actions__ = i(_.__actions__)),
    (a.__index__ = _.__index__),
    (a.__values__ = _.__values__),
    a
  );
}
var l = t;
export { l as _ };
