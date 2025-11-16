import { defOpVNV } from "./defopvnv.js";
import { $madd } from "./ops.js";
const [a, b, c, d] = defOpVNV($madd);
const maddN = a;
const maddN2 = b;
const maddN3 = c;
const maddN4 = d;
export {
  maddN,
  maddN2,
  maddN3,
  maddN4
};
