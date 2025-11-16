import { vop } from "./vop.js";
const sum2 = (a) => a[0] + a[1];
const sum3 = (a) => a[0] + a[1] + a[2];
const sum4 = (a) => a[0] + a[1] + a[2] + a[3];
const sum = vop(
  0,
  (v) => {
    let res = 0;
    for (let i = v.length; i-- > 0; ) res += v[i];
    return res;
  },
  sum2,
  sum3,
  sum4
);
export {
  sum,
  sum2,
  sum3,
  sum4
};
