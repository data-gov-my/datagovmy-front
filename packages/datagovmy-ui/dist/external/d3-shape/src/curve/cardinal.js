function s(i, t, _) {
  i._context.bezierCurveTo(
    i._x1 + i._k * (i._x2 - i._x0),
    i._y1 + i._k * (i._y2 - i._y0),
    i._x2 + i._k * (i._x1 - t),
    i._y2 + i._k * (i._y1 - _),
    i._x2,
    i._y2
  );
}
function e(i, t) {
  (this._context = i), (this._k = (1 - t) / 6);
}
e.prototype = {
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
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        s(this, this._x1, this._y1);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (i, t) {
    switch (((i = +i), (t = +t), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(i, t) : this._context.moveTo(i, t);
        break;
      case 1:
        (this._point = 2), (this._x1 = i), (this._y1 = t);
        break;
      case 2:
        this._point = 3;
      default:
        s(this, i, t);
        break;
    }
    (this._x0 = this._x1),
      (this._x1 = this._x2),
      (this._x2 = i),
      (this._y0 = this._y1),
      (this._y1 = this._y2),
      (this._y2 = t);
  },
};
const o = (function i(t) {
  function _(n) {
    return new e(n, t);
  }
  return (
    (_.tension = function (n) {
      return i(+n);
    }),
    _
  );
})(0);
export { e as Cardinal, o as default, s as point };
