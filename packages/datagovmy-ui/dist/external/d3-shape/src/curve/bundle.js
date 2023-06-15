import { Basis as _ } from "./basis.js";
function a(t, i) {
  (this._basis = new _(t)), (this._beta = i);
}
a.prototype = {
  lineStart: function () {
    (this._x = []), (this._y = []), this._basis.lineStart();
  },
  lineEnd: function () {
    var t = this._x,
      i = this._y,
      n = t.length - 1;
    if (n > 0)
      for (var s = t[0], u = i[0], o = t[n] - s, r = i[n] - u, e = -1, h; ++e <= n; )
        (h = e / n),
          this._basis.point(
            this._beta * t[e] + (1 - this._beta) * (s + h * o),
            this._beta * i[e] + (1 - this._beta) * (u + h * r)
          );
    (this._x = this._y = null), this._basis.lineEnd();
  },
  point: function (t, i) {
    this._x.push(+t), this._y.push(+i);
  },
};
const b = (function t(i) {
  function n(s) {
    return i === 1 ? new _(s) : new a(s, i);
  }
  return (
    (n.beta = function (s) {
      return t(+s);
    }),
    n
  );
})(0.85);
export { b as default };
