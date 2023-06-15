var r = function (c, e) {
  return e ? c.replace(/\/+$/, "") + "/" + e.replace(/^\/+/, "") : c;
};
export { r as c };
