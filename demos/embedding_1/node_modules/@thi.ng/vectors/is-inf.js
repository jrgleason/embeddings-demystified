import { defOpVNew } from "./defopv-new.js";
const [a, b, c, d] = defOpVNew((a2) => !isFinite(a2), 1);
const isInf = a;
const isInf2 = b;
const isInf3 = c;
const isInf4 = d;
export {
  isInf,
  isInf2,
  isInf3,
  isInf4
};
