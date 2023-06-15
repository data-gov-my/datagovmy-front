import { CardinalClosed as o } from "./cardinalClosed.js";
import h from "../noop.js";
import { point as n } from "./catmullRom.js";
function a(i, t) {
  (this._context = i), (this._alpha = t);
}
a.prototype = {
  areaStart: h,
  areaEnd: h,
  lineStart: function () {
    (this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._x5 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
      this._y5 =
        NaN),
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
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3),
          this.point(this._x4, this._y4),
          this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function (i, t) {
    if (((i = +i), (t = +t), this._point)) {
      var _ = this._x2 - i,
        s = this._y2 - t;
      this._l23_a = Math.sqrt((this._l23_2a = Math.pow(_ * _ + s * s, this._alpha)));
    }
    switch (this._point) {
      case 0:
        (this._point = 1), (this._x3 = i), (this._y3 = t);
        break;
      case 1:
        (this._point = 2), this._context.moveTo((this._x4 = i), (this._y4 = t));
        break;
      case 2:
        (this._point = 3), (this._x5 = i), (this._y5 = t);
        break;
      default:
        n(this, i, t);
        break;
    }
    (this._l01_a = this._l12_a),
      (this._l12_a = this._l23_a),
      (this._l01_2a = this._l12_2a),
      (this._l12_2a = this._l23_2a),
      (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = i),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const c = (function i(t) {
  function _(s) {
    return t ? new a(s, t) : new o(s, 0);
  }
  return (
    (_.alpha = function (s) {
      return i(+s);
    }),
    _
  );
})(0.5);
export { c as default };
