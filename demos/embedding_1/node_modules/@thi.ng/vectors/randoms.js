import {} from "@thi.ng/random";
import { SYSTEM as op } from "@thi.ng/random/system";
const randomS2 = (a, n = -1, m = 1, rnd = op, ia = 0, sa = 1) => {
  !a && (a = []);
  a[ia] = rnd.minmax(n, m);
  a[ia + sa] = rnd.minmax(n, m);
  return a;
};
const randomS3 = (a, n = -1, m = 1, rnd = op, ia = 0, sa = 1) => {
  !a && (a = []);
  a[ia] = rnd.minmax(n, m);
  a[ia + sa] = rnd.minmax(n, m);
  a[ia + 2 * sa] = rnd.minmax(n, m);
  return a;
};
const randomS4 = (a, n = -1, m = 1, rnd = op, ia = 0, sa = 1) => {
  !a && (a = []);
  a[ia] = rnd.minmax(n, m);
  a[ia + sa] = rnd.minmax(n, m);
  a[ia + 2 * sa] = rnd.minmax(n, m);
  a[ia + 3 * sa] = rnd.minmax(n, m);
  return a;
};
const randomS = (a, num, n = -1, m = 1, rnd = op, ia = 0, sa = 1) => {
  !a && (a = []);
  while (num-- > 0) a[ia + num * sa] = rnd.minmax(n, m);
  return a;
};
export {
  randomS,
  randomS2,
  randomS3,
  randomS4
};
