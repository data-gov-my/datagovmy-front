var r = /\{\n\/\* \[wrapped with (.+)\] \*/,
  e = /,? & /;
function i(t) {
  var a = t.match(r);
  return a ? a[1].split(e) : [];
}
var p = i;
export { p as _ };
