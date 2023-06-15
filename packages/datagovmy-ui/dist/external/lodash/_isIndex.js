var n = 9007199254740991,
  o = /^(?:0|[1-9]\d*)$/;
function t(r, s) {
  var i = typeof r;
  return (
    (s = s ?? n),
    !!s && (i == "number" || (i != "symbol" && o.test(r))) && r > -1 && r % 1 == 0 && r < s
  );
}
var I = t;
export { I as _ };
