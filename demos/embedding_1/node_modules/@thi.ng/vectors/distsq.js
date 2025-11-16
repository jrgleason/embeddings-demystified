import { vop } from "./vop.js";
const distSq2 = (a, b) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
};
const distSq3 = (a, b) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
};
const distSq4 = (a, b) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  const dw = a[3] - b[3];
  return dx * dx + dy * dy + dz * dz + dw * dw;
};
const distSq = vop(
  0,
  (a, b) => {
    let sum = 0;
    for (let i = a.length; i-- > 0; ) {
      const d = a[i] - b[i];
      sum += d * d;
    }
    return sum;
  },
  distSq2,
  distSq3,
  distSq4
);
export {
  distSq,
  distSq2,
  distSq3,
  distSq4
};
