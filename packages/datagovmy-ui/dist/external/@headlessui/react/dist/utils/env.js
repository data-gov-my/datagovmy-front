var i = Object.defineProperty,
  s = (t, e, r) =>
    e in t ? i(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (t[e] = r),
  n = (t, e, r) => (s(t, typeof e != "symbol" ? e + "" : e, r), r);
class d {
  constructor() {
    n(this, "current", this.detect()), n(this, "handoffState", "pending"), n(this, "currentId", 0);
  }
  set(e) {
    this.current !== e &&
      ((this.handoffState = "pending"), (this.currentId = 0), (this.current = e));
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window > "u" || typeof document > "u" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
}
let h = new d();
export { h as env };
