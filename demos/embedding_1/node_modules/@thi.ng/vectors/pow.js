import { defOpVV } from "./defopvv.js";
const [a, b, c, d] = defOpVV(Math.pow);
const pow = a;
const pow2 = b;
const pow3 = c;
const pow4 = d;
export {
  pow,
  pow2,
  pow3,
  pow4
};
