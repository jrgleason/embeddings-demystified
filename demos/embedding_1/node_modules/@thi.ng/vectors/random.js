import {} from "@thi.ng/random";
import { SYSTEM } from "@thi.ng/random/system";
const random2 = (a, n = -1, m = 1, rnd = SYSTEM) => {
  !a && (a = []);
  a[0] = rnd.minmax(n, m);
  a[1] = rnd.minmax(n, m);
  return a;
};
const random3 = (a, n = -1, m = 1, rnd = SYSTEM) => {
  !a && (a = []);
  a[0] = rnd.minmax(n, m);
  a[1] = rnd.minmax(n, m);
  a[2] = rnd.minmax(n, m);
  return a;
};
const random4 = (a, n = -1, m = 1, rnd = SYSTEM) => {
  !a && (a = []);
  a[0] = rnd.minmax(n, m);
  a[1] = rnd.minmax(n, m);
  a[2] = rnd.minmax(n, m);
  a[3] = rnd.minmax(n, m);
  return a;
};
const random = (a, n = -1, m = 1, rnd = SYSTEM) => {
  !a && (a = []);
  for (let i = a.length; i-- > 0; ) a[i] = rnd.minmax(n, m);
  return a;
};
export {
  random,
  random2,
  random3,
  random4
};
