function n(t, i) {
  (this._context = t), (this._t = i);
}
n.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x = this._y = NaN), (this._point = 0);
  },
  lineEnd: function () {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y),
      (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      this._line >= 0 && ((this._t = 1 - this._t), (this._line = 1 - this._line));
  },
  point: function (t, i) {
    switch (((t = +t), (i = +i), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(t, i) : this._context.moveTo(t, i);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) this._context.lineTo(this._x, i), this._context.lineTo(t, i);
        else {
          var e = this._x * (1 - this._t) + t * this._t;
          this._context.lineTo(e, this._y), this._context.lineTo(e, i);
        }
        break;
      }
    }
    (this._x = t), (this._y = i);
  },
};
function s(t) {
  return new n(t, 0.5);
}
function h(t) {
  return new n(t, 0);
}
function _(t) {
  return new n(t, 1);
}
export { s as default, _ as stepAfter, h as stepBefore };
