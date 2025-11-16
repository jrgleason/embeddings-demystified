import { safeDiv as op } from "@thi.ng/math/safe-div";
import { defOpVV } from "./defopvv.js";
const [a, b, c, d] = defOpVV(op);
const safeDiv = a;
const safeDiv2 = b;
const safeDiv3 = c;
const safeDiv4 = d;
export {
  safeDiv,
  safeDiv2,
  safeDiv3,
  safeDiv4
};
