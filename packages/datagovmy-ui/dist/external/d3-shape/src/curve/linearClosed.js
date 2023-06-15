import o from "../noop.js";
function i(t) {
  this._context = t;
}
i.prototype = {
  areaStart: o,
  areaEnd: o,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    this._point && this._context.closePath();
  },
  point: function (t, n) {
    (t = +t),
      (n = +n),
      this._point ? this._context.lineTo(t, n) : ((this._point = 1), this._context.moveTo(t, n));
  },
};
function r(t) {
  return new i(t);
}
export { r as default };
