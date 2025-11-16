import { mixBilinear as op } from "@thi.ng/math/mix";
import { vop } from "./vop.js";
const mixBilinear2 = (o, a, b, c, d, u, v) => {
  !o && (o = a);
  o[0] = op(a[0], b[0], c[0], d[0], u, v);
  o[1] = op(a[1], b[1], c[1], d[1], u, v);
  return o;
};
const mixBilinear3 = (o, a, b, c, d, u, v) => {
  !o && (o = a);
  o[0] = op(a[0], b[0], c[0], d[0], u, v);
  o[1] = op(a[1], b[1], c[1], d[1], u, v);
  o[2] = op(a[2], b[2], c[2], d[2], u, v);
  return o;
};
const mixBilinear4 = (o, a, b, c, d, u, v) => {
  !o && (o = a);
  o[0] = op(a[0], b[0], c[0], d[0], u, v);
  o[1] = op(a[1], b[1], c[1], d[1], u, v);
  o[2] = op(a[2], b[2], c[2], d[2], u, v);
  o[3] = op(a[3], b[3], c[3], d[3], u, v);
  return o;
};
const mixBilinear = vop(
  1,
  (o, a, b, c, d, u, v) => {
    !o && (o = a);
    for (let i = a.length; i-- > 0; )
      o[i] = op(a[i], b[i], c[i], d[i], u, v);
    return o;
  },
  mixBilinear2,
  mixBilinear3,
  mixBilinear4
);
export {
  mixBilinear,
  mixBilinear2,
  mixBilinear3,
  mixBilinear4
};
