import s from "../noop.js";
import { point as _ } from "./basis.js";
function h(t) {
  this._context = t;
}
h.prototype = {
  areaStart: s,
  areaEnd: s,
  lineStart: function () {
    (this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
        NaN),
      (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3),
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3),
          this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2),
          this.point(this._x3, this._y3),
          this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function (t, i) {
    switch (((t = +t), (i = +i), this._point)) {
      case 0:
        (this._point = 1), (this._x2 = t), (this._y2 = i);
        break;
      case 1:
        (this._point = 2), (this._x3 = t), (this._y3 = i);
        break;
      case 2:
        (this._point = 3),
          (this._x4 = t),
          (this._y4 = i),
          this._context.moveTo(
            (this._x0 + 4 * this._x1 + t) / 6,
            (this._y0 + 4 * this._y1 + i) / 6
          );
        break;
      default:
        _(this, t, i);
        break;
    }
    (this._x0 = this._x1), (this._x1 = t), (this._y0 = this._y1), (this._y1 = i);
  },
};
function n(t) {
  return new h(t);
}
export { n as default };
