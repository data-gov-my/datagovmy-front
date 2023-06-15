var t = Math.ceil,
  n = Math.floor,
  o =
    Math.trunc ||
    function (a) {
      var r = +a;
      return (r > 0 ? n : t)(r);
    };
export { o as m };
