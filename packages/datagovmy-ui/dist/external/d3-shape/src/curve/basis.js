function s(i, t, n) {
  i._context.bezierCurveTo(
    (2 * i._x0 + i._x1) / 3,
    (2 * i._y0 + i._y1) / 3,
    (i._x0 + 2 * i._x1) / 3,
    (i._y0 + 2 * i._y1) / 3,
    (i._x0 + 4 * i._x1 + t) / 6,
    (i._y0 + 4 * i._y1 + n) / 6
  );
}
function _(i) {
  this._context = i;
}
_.prototype = {
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
    switch (this._point) {
      case 3:
        s(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
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
        this._point = 2;
        break;
      case 2:
        (this._point = 3),
          this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        s(this, i, t);
        break;
    }
    (this._x0 = this._x1), (this._x1 = i), (this._y0 = this._y1), (this._y1 = t);
  },
};
function e(i) {
  return new _(i);
}
export { _ as Basis, e as default, s as point };
