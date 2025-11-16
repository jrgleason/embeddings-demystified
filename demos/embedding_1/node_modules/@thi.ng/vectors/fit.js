import { fit as op } from "@thi.ng/math/fit";
import { vop } from "./vop.js";
const fit2 = (o, a, b, c, d, e) => {
  !o && (o = a);
  o[0] = op(a[0], b[0], c[0], d[0], e[0]);
  o[1] = op(a[1], b[1], c[1], d[1], e[1]);
  return o;
};
const fit3 = (o, a, b, c, d, e) => {
  !o && (o = a);
  o[0] = op(a[0], b[0], c[0], d[0], e[0]);
  o[1] = op(a[1], b[1], c[1], d[1], e[1]);
  o[2] = op(a[2], b[2], c[2], d[2], e[2]);
  return o;
};
const fit4 = (o, a, b, c, d, e) => {
  !o && (o = a);
  o[0] = op(a[0], b[0], c[0], d[0], e[0]);
  o[1] = op(a[1], b[1], c[1], d[1], e[1]);
  o[2] = op(a[2], b[2], c[2], d[2], e[2]);
  o[3] = op(a[3], b[3], c[3], d[3], e[3]);
  return o;
};
const fit = vop(
  1,
  (o, a, b, c, d, e) => {
    !o && (o = a);
    for (let i = a.length; i-- > 0; )
      o[i] = op(a[i], b[i], c[i], d[i], e[i]);
    return o;
  },
  fit2,
  fit3,
  fit4
);
export {
  fit,
  fit2,
  fit3,
  fit4
};
