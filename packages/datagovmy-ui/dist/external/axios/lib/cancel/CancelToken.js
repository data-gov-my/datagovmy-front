import { __require as l } from "./CanceledError.js";
var c, a;
function p() {
  if (a) return c;
  a = 1;
  var f = l();
  function s(t) {
    if (typeof t != "function") throw new TypeError("executor must be a function.");
    var n;
    this.promise = new Promise(function (r) {
      n = r;
    });
    var e = this;
    this.promise.then(function (i) {
      if (e._listeners) {
        var r,
          o = e._listeners.length;
        for (r = 0; r < o; r++) e._listeners[r](i);
        e._listeners = null;
      }
    }),
      (this.promise.then = function (i) {
        var r,
          o = new Promise(function (u) {
            e.subscribe(u), (r = u);
          }).then(i);
        return (
          (o.cancel = function () {
            e.unsubscribe(r);
          }),
          o
        );
      }),
      t(function (r) {
        e.reason || ((e.reason = new f(r)), n(e.reason));
      });
  }
  return (
    (s.prototype.throwIfRequested = function () {
      if (this.reason) throw this.reason;
    }),
    (s.prototype.subscribe = function (n) {
      if (this.reason) {
        n(this.reason);
        return;
      }
      this._listeners ? this._listeners.push(n) : (this._listeners = [n]);
    }),
    (s.prototype.unsubscribe = function (n) {
      if (this._listeners) {
        var e = this._listeners.indexOf(n);
        e !== -1 && this._listeners.splice(e, 1);
      }
    }),
    (s.source = function () {
      var n,
        e = new s(function (r) {
          n = r;
        });
      return {
        token: e,
        cancel: n,
      };
    }),
    (c = s),
    c
  );
}
export { p as __require };
