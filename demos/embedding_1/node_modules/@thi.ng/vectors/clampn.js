import { clamp as op } from "@thi.ng/math/interval";
import { vop } from "./vop.js";
const clampN2 = (o, a, b, c) => {
  !o && (o = a);
  o[0] = op(a[0], b, c);
  o[1] = op(a[1], b, c);
  return o;
};
const clampN3 = (o, a, b, c) => {
  !o && (o = a);
  o[0] = op(a[0], b, c);
  o[1] = op(a[1], b, c);
  o[2] = op(a[2], b, c);
  return o;
};
const clampN4 = (o, a, b, c) => {
  !o && (o = a);
  o[0] = op(a[0], b, c);
  o[1] = op(a[1], b, c);
  o[2] = op(a[2], b, c);
  o[3] = op(a[3], b, c);
  return o;
};
const clampN = vop(
  1,
  (o, a, b, c) => {
    !o && (o = a);
    for (let i = a.length; i-- > 0; ) o[i] = op(a[i], b, c);
    return o;
  },
  clampN2,
  clampN3,
  clampN4
);
export {
  clampN,
  clampN2,
  clampN3,
  clampN4
};
