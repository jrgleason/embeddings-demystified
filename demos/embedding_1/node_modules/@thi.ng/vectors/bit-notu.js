import { defOpV } from "./defopv.js";
const [a, b, c, d] = defOpV((a2) => ~a2 >>> 0);
const bitNotU = a;
const bitNotU2 = b;
const bitNotU3 = c;
const bitNotU4 = d;
export {
  bitNotU,
  bitNotU2,
  bitNotU3,
  bitNotU4
};
