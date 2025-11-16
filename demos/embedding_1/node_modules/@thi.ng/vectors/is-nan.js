import { defOpVNew } from "./defopv-new.js";
const op = globalThis.isNaN;
const [a, b, c, d] = defOpVNew((a2) => op(a2), 1);
const isNaN = a;
const isNaN2 = b;
const isNaN3 = c;
const isNaN4 = d;
export {
  isNaN,
  isNaN2,
  isNaN3,
  isNaN4
};
