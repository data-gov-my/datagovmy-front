import { _adapters as o } from "../../chart.js/dist/chart.js";
import { DateTime as i } from "luxon";
/*!
 * chartjs-adapter-luxon v1.3.1
 * https://www.chartjs.org
 * (c) 2023 chartjs-adapter-luxon Contributors
 * Released under the MIT license
 */
const s = {
  datetime: i.DATETIME_MED_WITH_SECONDS,
  millisecond: "h:mm:ss.SSS a",
  second: i.TIME_WITH_SECONDS,
  minute: i.TIME_SIMPLE,
  hour: { hour: "numeric" },
  day: { day: "numeric", month: "short" },
  week: "DD",
  month: { month: "short", year: "numeric" },
  quarter: "'Q'q - yyyy",
  year: { year: "numeric" },
};
o._date.override({
  _id: "luxon",
  // DEBUG
  /**
   * @private
   */
  _create: function (t) {
    return i.fromMillis(t, this.options);
  },
  init(t) {
    this.options.locale || (this.options.locale = t.locale);
  },
  formats: function () {
    return s;
  },
  parse: function (t, e) {
    const r = this.options,
      n = typeof t;
    return t === null || n === "undefined"
      ? null
      : (n === "number"
          ? (t = this._create(t))
          : n === "string"
          ? typeof e == "string"
            ? (t = i.fromFormat(t, e, r))
            : (t = i.fromISO(t, r))
          : t instanceof Date
          ? (t = i.fromJSDate(t, r))
          : n === "object" && !(t instanceof i) && (t = i.fromObject(t, r)),
        t.isValid ? t.valueOf() : null);
  },
  format: function (t, e) {
    const r = this._create(t);
    return typeof e == "string" ? r.toFormat(e) : r.toLocaleString(e);
  },
  add: function (t, e, r) {
    const n = {};
    return (n[r] = e), this._create(t).plus(n).valueOf();
  },
  diff: function (t, e, r) {
    return this._create(t).diff(this._create(e)).as(r).valueOf();
  },
  startOf: function (t, e, r) {
    if (e === "isoWeek") {
      r = Math.trunc(Math.min(Math.max(0, r), 6));
      const n = this._create(t);
      return n
        .minus({ days: (n.weekday - r + 7) % 7 })
        .startOf("day")
        .valueOf();
    }
    return e ? this._create(t).startOf(e).valueOf() : t;
  },
  endOf: function (t, e) {
    return this._create(t).endOf(e).valueOf();
  },
});
