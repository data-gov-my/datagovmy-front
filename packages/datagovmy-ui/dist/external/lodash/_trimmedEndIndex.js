var t = /\s/;
function n(r) {
  for (var e = r.length; e-- && t.test(r.charAt(e)); );
  return e;
}
var d = n;
export { d as _ };
