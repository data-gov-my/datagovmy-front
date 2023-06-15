function a(e, p, l) {
  switch (l.length) {
    case 0:
      return e.call(p);
    case 1:
      return e.call(p, l[0]);
    case 2:
      return e.call(p, l[0], l[1]);
    case 3:
      return e.call(p, l[0], l[1], l[2]);
  }
  return e.apply(p, l);
}
var c = a;
export { c as _ };
