import { CardinalOpen as n } from "./cardinalOpen.js";
import { point as a } from "./catmullRom.js";
function h(i, t) {
  (this._context = i), (this._alpha = t);
}
h.prototype = {
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
    (this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (i, t) {
    if (((i = +i), (t = +t), this._point)) {
      var s = this._x2 - i,
        _ = this._y2 - t;
      this._l23_a = Math.sqrt((this._l23_2a = Math.pow(s * s + _ * _, this._alpha)));
    }
    switch (this._point) {
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
        a(this, i, t);
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
const e = (function i(t) {
  function s(_) {
    return t ? new h(_, t) : new n(_, 0);
  }
  return (
    (s.alpha = function (_) {
      return i(+_);
    }),
    s
  );
})(0.5);
export { e as default };
