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
    (this._x = []), (this._y = []);
  },
  lineEnd: function () {
    var i = this._x,
      t = this._y,
      n = i.length;
    if (n)
      if (
        (this._line ? this._context.lineTo(i[0], t[0]) : this._context.moveTo(i[0], t[0]), n === 2)
      )
        this._context.lineTo(i[1], t[1]);
      else
        for (var s = h(i), o = h(t), e = 0, r = 1; r < n; ++e, ++r)
          this._context.bezierCurveTo(s[0][e], o[0][e], s[1][e], o[1][e], i[r], t[r]);
    (this._line || (this._line !== 0 && n === 1)) && this._context.closePath(),
      (this._line = 1 - this._line),
      (this._x = this._y = null);
  },
  point: function (i, t) {
    this._x.push(+i), this._y.push(+t);
  },
};
function h(i) {
  var t,
    n = i.length - 1,
    s,
    o = new Array(n),
    e = new Array(n),
    r = new Array(n);
  for (o[0] = 0, e[0] = 2, r[0] = i[0] + 2 * i[1], t = 1; t < n - 1; ++t)
    (o[t] = 1), (e[t] = 4), (r[t] = 4 * i[t] + 2 * i[t + 1]);
  for (o[n - 1] = 2, e[n - 1] = 7, r[n - 1] = 8 * i[n - 1] + i[n], t = 1; t < n; ++t)
    (s = o[t] / e[t - 1]), (e[t] -= s), (r[t] -= s * r[t - 1]);
  for (o[n - 1] = r[n - 1] / e[n - 1], t = n - 2; t >= 0; --t) o[t] = (r[t] - o[t + 1]) / e[t];
  for (e[n - 1] = (i[n] + o[n - 1]) / 2, t = 0; t < n - 1; ++t) e[t] = 2 * i[t + 1] - o[t + 1];
  return [o, e];
}
function a(i) {
  return new _(i);
}
export { a as default };
