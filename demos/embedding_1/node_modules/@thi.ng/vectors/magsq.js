import { vop } from "./vop.js";
const magSq2 = (a) => a[0] * a[0] + a[1] * a[1];
const magSq3 = (a) => a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
const magSq4 = (a) => a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
const magSq = vop(
  0,
  (a) => {
    let sum = 0;
    for (let i = a.length; i-- > 0; ) sum += a[i] * a[i];
    return sum;
  },
  magSq2,
  magSq3,
  magSq4
);
export {
  magSq,
  magSq2,
  magSq3,
  magSq4
};
