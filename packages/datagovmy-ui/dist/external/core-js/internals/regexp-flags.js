import { a as n } from "./an-object.js";
var r, a;
function u() {
  if (a) return r;
  a = 1;
  var t = n;
  return (
    (r = function () {
      var i = t(this),
        e = "";
      return (
        i.hasIndices && (e += "d"),
        i.global && (e += "g"),
        i.ignoreCase && (e += "i"),
        i.multiline && (e += "m"),
        i.dotAll && (e += "s"),
        i.unicode && (e += "u"),
        i.unicodeSets && (e += "v"),
        i.sticky && (e += "y"),
        e
      );
    }),
    r
  );
}
export { u as __require };
