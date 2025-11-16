import {} from "@thi.ng/random";
import { SYSTEM as op } from "@thi.ng/random/system";
import { vop } from "./vop.js";
const randMinMax2 = (o, a, b, rnd = op) => {
  !o && (o = a);
  o[0] = rnd.minmax(a[0], b[0]);
  o[1] = rnd.minmax(a[1], b[1]);
  return o;
};
const randMinMax3 = (o, a, b, rnd = op) => {
  !o && (o = a);
  o[0] = rnd.minmax(a[0], b[0]);
  o[1] = rnd.minmax(a[1], b[1]);
  o[2] = rnd.minmax(a[2], b[2]);
  return o;
};
const randMinMax4 = (o, a, b, rnd = op) => {
  !o && (o = a);
  o[0] = rnd.minmax(a[0], b[0]);
  o[1] = rnd.minmax(a[1], b[1]);
  o[2] = rnd.minmax(a[2], b[2]);
  o[3] = rnd.minmax(a[3], b[3]);
  return o;
};
const randMinMax = vop(
  1,
  (o, a, b, rnd = op) => {
    !o && (o = a);
    for (let i = a.length; i-- > 0; ) o[i] = rnd.minmax(a[i], b[i]);
    return o;
  }
);
export {
  randMinMax,
  randMinMax2,
  randMinMax3,
  randMinMax4
};
