function n(t) {
  this._context = t;
}
n.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (t, i) {
    switch (((t = +t), (i = +i), this._point)) {
      case 0:
        (this._point = 1), this._line ? this._context.lineTo(t, i) : this._context.moveTo(t, i);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(t, i);
        break;
    }
  },
};
function e(t) {
  return new n(t);
}
export { e as default };
