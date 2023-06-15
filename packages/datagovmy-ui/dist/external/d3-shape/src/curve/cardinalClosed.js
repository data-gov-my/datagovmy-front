import _ from "../noop.js";
import { point as o } from "./cardinal.js";
function n(t, i) {
  (this._context = t), (this._k = (1 - i) / 6);
}
n.prototype = {
  areaStart: _,
  areaEnd: _,
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
      (this._point = 0);
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
  point: function (t, i) {
    switch (((t = +t), (i = +i), this._point)) {
      case 0:
        (this._point = 1), (this._x3 = t), (this._y3 = i);
        break;
      case 1:
        (this._point = 2), this._context.moveTo((this._x4 = t), (this._y4 = i));
        break;
      case 2:
        (this._point = 3), (this._x5 = t), (this._y5 = i);
        break;
      default:
        o(this, t, i);
        break;
    }
    (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = t),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = i);
  },
};
const c = (function t(i) {
  function h(s) {
    return new n(s, i);
  }
  return (
    (h.tension = function (s) {
      return t(+s);
    }),
    h
  );
})(0);
export { n as CardinalClosed, c as default };
