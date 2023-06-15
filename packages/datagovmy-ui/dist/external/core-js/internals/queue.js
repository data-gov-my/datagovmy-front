var i, n;
function a() {
  if (n) return i;
  n = 1;
  var u = function () {
    (this.head = null), (this.tail = null);
  };
  return (
    (u.prototype = {
      add: function (e) {
        var t = { item: e, next: null },
          r = this.tail;
        r ? (r.next = t) : (this.head = t), (this.tail = t);
      },
      get: function () {
        var e = this.head;
        if (e) {
          var t = (this.head = e.next);
          return t === null && (this.tail = null), e.item;
        }
      },
    }),
    (i = u),
    i
  );
}
export { a as __require };
