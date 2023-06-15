import { _ as i } from "./_assocIndexOf.js";
var r = i;
function _(t, a) {
  var s = this.__data__,
    e = r(s, t);
  return e < 0 ? (++this.size, s.push([t, a])) : (s[e][1] = a), this;
}
var n = _;
export { n as _ };
