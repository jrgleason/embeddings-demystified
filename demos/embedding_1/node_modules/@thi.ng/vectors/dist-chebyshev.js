import { vop } from "./vop.js";
const { abs, max } = Math;
const distChebyshev2 = (a, b) => max(abs(a[0] - b[0]), abs(a[1] - b[1]));
const distChebyshev3 = (a, b) => max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]));
const distChebyshev4 = (a, b) => max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]), abs(a[3] - b[3]));
const distChebyshev = vop(
  0,
  (a, b) => {
    let d = 0;
    for (let i = a.length; i-- > 0; ) {
      d = max(d, abs(a[i] - b[i]));
    }
    return d;
  },
  distChebyshev2,
  distChebyshev3,
  distChebyshev4
);
export {
  distChebyshev,
  distChebyshev2,
  distChebyshev3,
  distChebyshev4
};
