import { defOpV } from "./defopv.js";
const { sqrt } = Math;
const [a, b, c, d] = defOpV((a2) => 1 / sqrt(a2));
const invSqrt = a;
const invSqrt2 = b;
const invSqrt3 = c;
const invSqrt4 = d;
export {
  invSqrt,
  invSqrt2,
  invSqrt3,
  invSqrt4
};
