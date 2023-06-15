import o from "./locale.js";
var r, t;
e({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-",
});
function e(a) {
  return (r = o(a)), (t = r.format), r.formatPrefix, r;
}
export { e as default, t as format };
