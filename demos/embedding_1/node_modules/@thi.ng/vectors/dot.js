import { vop } from "./vop.js";
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const dot4 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
const dot = vop(
  0,
  (a, b) => {
    let sum = 0;
    for (let i = a.length; i-- > 0; ) sum += a[i] * b[i];
    return sum;
  },
  dot2,
  dot3,
  dot4
);
export {
  dot,
  dot2,
  dot3,
  dot4
};
