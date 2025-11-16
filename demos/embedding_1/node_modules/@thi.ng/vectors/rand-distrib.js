import { normal as op } from "@thi.ng/random/distributions/normal";
import { vop } from "./vop.js";
const randDistrib2 = (a, rnd = op(), n = 1) => {
  !a && (a = []);
  a[0] = rnd() * n;
  a[1] = rnd() * n;
  return a;
};
const randDistrib3 = (a, rnd = op(), n = 1) => {
  !a && (a = []);
  a[0] = rnd() * n;
  a[1] = rnd() * n;
  a[2] = rnd() * n;
  return a;
};
const randDistrib4 = (a, rnd = op(), n = 1) => {
  !a && (a = []);
  a[0] = rnd() * n;
  a[1] = rnd() * n;
  a[2] = rnd() * n;
  a[3] = rnd() * n;
  return a;
};
const randDistrib = vop(
  0,
  (a, rnd = op(), n = 1) => {
    !a && (a = []);
    for (let i = a.length; i-- > 0; ) a[i] = rnd() * n;
    return a;
  },
  randDistrib2,
  randDistrib3,
  randDistrib4
);
export {
  randDistrib,
  randDistrib2,
  randDistrib3,
  randDistrib4
};
