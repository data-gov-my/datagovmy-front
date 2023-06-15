import { point as _ } from "./cardinal.js";
function h(t, i) {
  (this._context = t), (this._k = (1 - i) / 6);
}
h.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN), (this._point = 0);
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
        (this._point = 3),
          this._line
            ? this._context.lineTo(this._x2, this._y2)
            : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        _(this, t, i);
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
const o = (function t(i) {
  function s(n) {
    return new h(n, i);
  }
  return (
    (s.tension = function (n) {
      return t(+n);
    }),
    s
  );
})(0);
export { h as CardinalOpen, o as default };
