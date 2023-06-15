import { epsilon as c } from "../math.js";
import { Cardinal as u } from "./cardinal.js";
function f(_, i, l) {
  var s = _._x1,
    n = _._y1,
    o = _._x2,
    t = _._y2;
  if (_._l01_a > c) {
    var e = 2 * _._l01_2a + 3 * _._l01_a * _._l12_a + _._l12_2a,
      a = 3 * _._l01_a * (_._l01_a + _._l12_a);
    (s = (s * e - _._x0 * _._l12_2a + _._x2 * _._l01_2a) / a),
      (n = (n * e - _._y0 * _._l12_2a + _._y2 * _._l01_2a) / a);
  }
  if (_._l23_a > c) {
    var h = 2 * _._l23_2a + 3 * _._l23_a * _._l12_a + _._l12_2a,
      r = 3 * _._l23_a * (_._l23_a + _._l12_a);
    (o = (o * h + _._x1 * _._l23_2a - i * _._l12_2a) / r),
      (t = (t * h + _._y1 * _._l23_2a - l * _._l12_2a) / r);
  }
  _._context.bezierCurveTo(s, n, o, t, _._x2, _._y2);
}
function p(_, i) {
  (this._context = _), (this._alpha = i);
}
p.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN),
      (this._l01_a =
        this._l12_a =
        this._l23_a =
        this._l01_2a =
        this._l12_2a =
        this._l23_2a =
        this._point =
          0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (_, i) {
    if (((_ = +_), (i = +i), this._point)) {
      var l = this._x2 - _,
        s = this._y2 - i;
      this._l23_a = Math.sqrt((this._l23_2a = Math.pow(l * l + s * s, this._alpha)));
    }
    switch (this._point) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(_, i) : this._context.moveTo(_, i);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        f(this, _, i);
        break;
    }
    (this._l01_a = this._l12_a),
      (this._l12_a = this._l23_a),
      (this._l01_2a = this._l12_2a),
      (this._l12_2a = this._l23_2a),
      (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = _),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = i);
  },
};
const m = (function _(i) {
  function l(s) {
    return i ? new p(s, i) : new u(s, 0);
  }
  return (
    (l.alpha = function (s) {
      return _(+s);
    }),
    l
  );
})(0.5);
export { m as default, f as point };
