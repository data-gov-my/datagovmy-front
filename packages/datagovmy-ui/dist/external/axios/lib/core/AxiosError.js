import { u as h } from "../utils.js";
var a = h;
function e(t, r, i, o, n) {
  Error.call(this),
    (this.message = t),
    (this.name = "AxiosError"),
    r && (this.code = r),
    i && (this.config = i),
    o && (this.request = o),
    n && (this.response = n);
}
a.inherits(e, Error, {
  toJSON: function () {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null,
    };
  },
});
var u = e.prototype,
  R = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  // eslint-disable-next-line func-names
].forEach(function (t) {
  R[t] = { value: t };
});
Object.defineProperties(e, R);
Object.defineProperty(u, "isAxiosError", { value: !0 });
e.from = function (t, r, i, o, n, E) {
  var s = Object.create(u);
  return (
    a.toFlatObject(t, s, function (c) {
      return c !== Error.prototype;
    }),
    e.call(s, t.message, r, i, o, n),
    (s.name = t.name),
    E && Object.assign(s, E),
    s
  );
};
var O = e;
export { O as A };
