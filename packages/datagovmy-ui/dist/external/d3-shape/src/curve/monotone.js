function u(t) {
  return t < 0 ? -1 : 1;
}
function a(t, i, n) {
  var o = t._x1 - t._x0,
    s = i - t._x1,
    e = (t._y1 - t._y0) / (o || (s < 0 && -0)),
    _ = (n - t._y1) / (s || (o < 0 && -0)),
    h = (e * s + _ * o) / (o + s);
  return (u(e) + u(_)) * Math.min(Math.abs(e), Math.abs(_), 0.5 * Math.abs(h)) || 0;
}
function p(t, i) {
  var n = t._x1 - t._x0;
  return n ? ((3 * (t._y1 - t._y0)) / n - i) / 2 : i;
}
function r(t, i, n) {
  var o = t._x0,
    s = t._y0,
    e = t._x1,
    _ = t._y1,
    h = (e - o) / 3;
  t._context.bezierCurveTo(o + h, s + h * i, e - h, _ - h * n, e, _);
}
function c(t) {
  this._context = t;
}
c.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    (this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN), (this._point = 0);
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        r(this, this._t0, p(this, this._t0));
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line);
  },
  point: function (t, i) {
    var n = NaN;
    if (((t = +t), (i = +i), !(t === this._x1 && i === this._y1))) {
      switch (this._point) {
        case 0:
          (this._point = 1), this._line ? this._context.lineTo(t, i) : this._context.moveTo(t, i);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          (this._point = 3), r(this, p(this, (n = a(this, t, i))), n);
          break;
        default:
          r(this, this._t0, (n = a(this, t, i)));
          break;
      }
      (this._x0 = this._x1), (this._x1 = t), (this._y0 = this._y1), (this._y1 = i), (this._t0 = n);
    }
  },
};
function x(t) {
  this._context = new f(t);
}
(x.prototype = Object.create(c.prototype)).point = function (t, i) {
  c.prototype.point.call(this, i, t);
};
function f(t) {
  this._context = t;
}
f.prototype = {
  moveTo: function (t, i) {
    this._context.moveTo(i, t);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (t, i) {
    this._context.lineTo(i, t);
  },
  bezierCurveTo: function (t, i, n, o, s, e) {
    this._context.bezierCurveTo(i, t, o, n, e, s);
  },
};
function l(t) {
  return new c(t);
}
function y(t) {
  return new x(t);
}
export { l as monotoneX, y as monotoneY };
