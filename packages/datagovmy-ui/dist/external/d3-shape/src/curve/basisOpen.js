import { point as e } from "./basis.js";
function h(t) {
  this._context = t;
}
h.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (t, i) {
    switch (((t = +t), (i = +i), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var n = (this._x0 + 4 * this._x1 + t) / 6,
          s = (this._y0 + 4 * this._y1 + i) / 6;
        this._line ? this._context.lineTo(n, s) : this._context.moveTo(n, s);
        break;
      case 3:
        this._point = 4;
      default:
        e(this, t, i);
        break;
    }
    (this._x0 = this._x1), (this._x1 = t), (this._y0 = this._y1), (this._y1 = i);
  },
};
function o(t) {
  return new h(t);
}
export { o as default };
