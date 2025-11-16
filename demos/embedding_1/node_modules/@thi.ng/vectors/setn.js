import { vop } from "./vop.js";
const setN2 = (a, n) => {
  a[0] = n;
  a[1] = n;
  return a;
};
const setN3 = (a, n) => {
  a[0] = n;
  a[1] = n;
  a[2] = n;
  return a;
};
const setN4 = (a, n) => {
  a[0] = n;
  a[1] = n;
  a[2] = n;
  a[3] = n;
  return a;
};
const setN = vop(
  0,
  (a, n) => {
    for (let i = a.length; i-- > 0; ) a[i] = n;
    return a;
  },
  setN2,
  setN3,
  setN4
);
const zero = (a) => setN(a, 0);
const one = (a) => setN(a, 1);
const zeroes = (n) => Array(n).fill(0);
const ones = (n) => Array(n).fill(1);
export {
  one,
  ones,
  setN,
  setN2,
  setN3,
  setN4,
  zero,
  zeroes
};
