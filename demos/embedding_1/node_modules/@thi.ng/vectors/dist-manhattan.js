import { vop } from "./vop.js";
const { abs } = Math;
const distManhattan2 = (a, b) => abs(a[0] - b[0]) + abs(a[1] - b[1]);
const distManhattan3 = (a, b) => abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2]);
const distManhattan4 = (a, b) => abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2]) + abs(a[3] - b[3]);
const distManhattan = vop(
  0,
  (a, b) => {
    let d = 0;
    for (let i = a.length; i-- > 0; ) {
      d += abs(a[i] - b[i]);
    }
    return d;
  },
  distManhattan2,
  distManhattan3,
  distManhattan4
);
export {
  distManhattan,
  distManhattan2,
  distManhattan3,
  distManhattan4
};
