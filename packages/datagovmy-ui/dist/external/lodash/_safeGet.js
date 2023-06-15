function n(t, r) {
  if (!(r === "constructor" && typeof t[r] == "function") && r != "__proto__") return t[r];
}
var f = n;
export { f as _ };
